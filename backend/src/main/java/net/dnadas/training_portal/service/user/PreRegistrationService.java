package net.dnadas.training_portal.service.user;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dnadas.training_portal.dto.auth.PreRegistrationCompleteRequestDto;
import net.dnadas.training_portal.dto.email.EmailRequestDto;
import net.dnadas.training_portal.dto.user.PreRegisterUserInternalDto;
import net.dnadas.training_portal.dto.user.PreRegisterUsersReportDto;
import net.dnadas.training_portal.dto.user.PreRegistrationCompleteInternalDto;
import net.dnadas.training_portal.dto.user.PreRegistrationDetailsResponseDto;
import net.dnadas.training_portal.dto.verification.VerificationTokenDto;
import net.dnadas.training_portal.exception.auth.UserAlreadyExistsException;
import net.dnadas.training_portal.exception.group.GroupNotFoundException;
import net.dnadas.training_portal.exception.group.project.ProjectNotFoundException;
import net.dnadas.training_portal.exception.group.project.questionnaire.QuestionnaireNotFoundException;
import net.dnadas.training_portal.exception.user.InvalidExpirationDateException;
import net.dnadas.training_portal.model.auth.PermissionType;
import net.dnadas.training_portal.model.group.UserGroup;
import net.dnadas.training_portal.model.group.UserGroupDao;
import net.dnadas.training_portal.model.group.project.Project;
import net.dnadas.training_portal.model.group.project.ProjectDao;
import net.dnadas.training_portal.model.group.project.questionnaire.Questionnaire;
import net.dnadas.training_portal.model.group.project.questionnaire.QuestionnaireDao;
import net.dnadas.training_portal.model.user.ApplicationUser;
import net.dnadas.training_portal.model.user.ApplicationUserDao;
import net.dnadas.training_portal.model.verification.PreRegistrationVerificationToken;
import net.dnadas.training_portal.service.utils.datetime.DateTimeService;
import net.dnadas.training_portal.service.utils.email.EmailService;
import net.dnadas.training_portal.service.utils.email.EmailTemplateService;
import net.dnadas.training_portal.service.utils.file.CsvUtilsService;
import net.dnadas.training_portal.service.verification.VerificationTokenService;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.OutputStream;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PreRegistrationService {
  private static final Integer RECEIVED_CSV_MAX_SIZE = 400000;
  private static final String RECEIVED_CSV_CONTENT_TYPE = "text/csv";
  private static final String CSV_DELIMITER = ",";
  private static final List<String> CSV_HEADERS = List.of("Username", "Full Name", "Email",
    "Group Permissions: available: " + PermissionType.GROUP_ADMIN.name() + " " +
      PermissionType.GROUP_EDITOR.name() + " and " + PermissionType.GROUP_MEMBER.name() +
      " default: " + PermissionType.GROUP_MEMBER.name(),
    "Project Permissions: available: " + PermissionType.PROJECT_ADMIN.name() + " " +
      PermissionType.PROJECT_COORDINATOR.name() + " " + PermissionType.PROJECT_EDITOR.name() +
      " and " + PermissionType.PROJECT_ASSIGNED_MEMBER.name() + " default: " +
      PermissionType.PROJECT_ASSIGNED_MEMBER.name(), "Current Coordinator Full Name or NULL",
    "Current Data Preparator Full Name or NULL",
    "Has External Test Questionnaire: TRUE FALSE or NULL",
    "Has External Test Failure: TRUE FALSE or NULL");
  private static final long MAX_EXPIRATION_SECONDS = 60 * 60 * 24 * 365; // 1 year
  private final ApplicationUserDao applicationUserDao;
  private final UserGroupDao userGroupDao;
  private final ProjectDao projectDao;
  private final QuestionnaireDao questionnaireDao;
  private final VerificationTokenService verificationTokenService;
  private final CsvUtilsService csvUtilsService;
  private final EmailTemplateService emailTemplateService;
  private final EmailService emailService;
  private final PasswordEncoder passwordEncoder;
  private final DateTimeService dateTimeService;

  public void getPreRegisterUsersCsvTemplate(OutputStream outputStream) throws IOException {
    List<List<String>> exampleData = List.of(
      List.of("exampleUser1", "Example User 1", "example1@example.com", "GROUP_EDITOR",
        "PROJECT_ASSIGNED_MEMBER&PROJECT_EDITOR&PROJECT_ADMIN", "NULL", "NULL", "NULL", "NULL"),
      List.of("exampleUser2", "Example User 2", "example2@example.com", "GROUP_MEMBER",
        "PROJECT_ASSIGNED_MEMBER&PROJECT_COORDINATOR", "NULL", "NULL", "NULL", "NULL"),
      List.of("exampleUser3", "Example User 3", "example3@example.com", "GROUP_MEMBER",
        "PROJECT_ASSIGNED_MEMBER", "Example Coordinator", "Example Data Preparator", "TRUE",
        "FALSE"));
    csvUtilsService.writeCsvToStream(exampleData, CSV_DELIMITER, CSV_HEADERS, outputStream);
  }

  @Transactional(rollbackFor = Error.class)
  @Secured("ADMIN")
  public PreRegisterUsersReportDto preRegisterUsers(
    Long groupId, Long projectId, Long questionnaireId, MultipartFile usersCsv, String expiresAt,
    Locale locale) {
    List<PreRegisterUserInternalDto> updatedUsers = new ArrayList<>();
    List<PreRegisterUserInternalDto> createdUsers = new ArrayList<>();
    Map<PreRegisterUserInternalDto, String> failedUsers = new HashMap<>();
    Instant expirationDate = dateTimeService.toStoredDate(expiresAt);
    if (expirationDate.isBefore(Instant.now())) {
      throw new InvalidExpirationDateException("Expiration date must be in the future");
    }
    if (expirationDate.isAfter(Instant.now().plusSeconds(MAX_EXPIRATION_SECONDS))) {
      throw new InvalidExpirationDateException("Expiration date must be within a year");
    }

    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(
      groupId, projectId, questionnaireId).orElseThrow(QuestionnaireNotFoundException::new);
    Project project = questionnaire.getProject();
    UserGroup group = project.getUserGroup();

    List<PreRegisterUserInternalDto> userRequests = parsePreRegistrationCsv(usersCsv);

    for (PreRegisterUserInternalDto userRequest : userRequests) {
      try {
        ApplicationUser existingUser = applicationUserDao.findByEmailOrUsername(
          userRequest.email(), userRequest.username()).orElse(null);
        if (existingUser != null) {
          updateExistingUser(group, project, questionnaire, existingUser, userRequest);
          updatedUsers.add(userRequest);
        } else {
          handlePreRegistrationRequest(groupId, projectId, questionnaireId, userRequest,
            expirationDate, project.getName(), locale);
          createdUsers.add(userRequest);
        }
      } catch (Exception e) {
        failedUsers.put(userRequest, e.getMessage());
      }
    }
    return new PreRegisterUsersReportDto(
      userRequests.size(), updatedUsers, createdUsers, failedUsers);
  }

  @Transactional(rollbackFor = Exception.class)
  public PreRegistrationCompleteInternalDto processPreRegistration(
    VerificationTokenDto verificationTokenDto, PreRegistrationCompleteRequestDto requestDto) {
    PreRegistrationVerificationToken token =
      (PreRegistrationVerificationToken) verificationTokenService.findVerificationToken(
        verificationTokenDto);
    Optional<ApplicationUser> existingUser = applicationUserDao.findByEmailOrUsername(
      token.getEmail(), token.getUsername());
    if (existingUser.isPresent()) {
      throw new UserAlreadyExistsException();
    }
    UserGroup group = userGroupDao.findById(token.getGroupId()).orElseThrow(
      () -> new GroupNotFoundException(token.getGroupId()));
    Project project = projectDao.findById(token.getProjectId()).orElseThrow(
      () -> new ProjectNotFoundException(token.getProjectId()));
    Questionnaire questionnaire = questionnaireDao.findById(token.getQuestionnaireId()).orElseThrow(
      QuestionnaireNotFoundException::new);
    String fullName = getFullName(requestDto, token);
    ApplicationUser user = new ApplicationUser(token.getUsername(), token.getEmail(),
      passwordEncoder.encode(requestDto.password()), fullName);
    applicationUserDao.save(user);
    group.addMember(user);
    Set<PermissionType> groupPermissions = token.getGroupPermissions();
    if (groupPermissions.contains(PermissionType.GROUP_ADMIN)) {
      group.addAdmin(user);
    }
    if (groupPermissions.contains(PermissionType.GROUP_EDITOR)) {
      group.addEditor(user);
    }
    userGroupDao.save(group);
    project.assignMember(user);
    Set<PermissionType> projectPermissions = token.getProjectPermissions();
    if (projectPermissions.contains(PermissionType.PROJECT_ADMIN)) {
      project.addAdmin(user);
    }
    if (projectPermissions.contains(PermissionType.PROJECT_EDITOR)) {
      project.addEditor(user);
    }
    if (projectPermissions.contains(PermissionType.PROJECT_COORDINATOR)) {
      project.addCoordinator(user);
    }
    projectDao.save(project);
    user.setActiveQuestionnaire(questionnaire);
    if (token.getCurrentCoordinatorFullName() != null) {
      user.setCurrentCoordinatorFullName(token.getCurrentCoordinatorFullName());
    }
    if (token.getHasExternalTestQuestionnaire() != null) {
      user.setHasExternalTestQuestionnaire(token.getHasExternalTestQuestionnaire());
    }
    if (token.getHasExternalTestFailure() != null) {
      user.setHasExternalTestFailure(token.getHasExternalTestFailure());
    }
    applicationUserDao.save(user);
    verificationTokenService.deleteVerificationToken(token.getId());
    return new PreRegistrationCompleteInternalDto(user.getEmail());
  }

  @Transactional(readOnly = true)
  public PreRegistrationDetailsResponseDto getPreRegistrationDetails(
    VerificationTokenDto verificationTokenDto) {
    PreRegistrationVerificationToken token =
      (PreRegistrationVerificationToken) verificationTokenService.findVerificationToken(
        verificationTokenDto);
    return new PreRegistrationDetailsResponseDto(token.getUsername(), token.getFullName());
  }

  private String getFullName(
    PreRegistrationCompleteRequestDto requestDto, PreRegistrationVerificationToken token) {
    if (requestDto.fullName() != null) {
      return requestDto.fullName();
    }
    if (token.getUsername() != null) {
      return token.getUsername();
    }
    throw new IllegalArgumentException("Missing full name");
  }

  private List<PreRegisterUserInternalDto> parsePreRegistrationCsv(MultipartFile usersCsv) {
    csvUtilsService.verifyCsv(usersCsv, RECEIVED_CSV_CONTENT_TYPE, RECEIVED_CSV_MAX_SIZE);
    List<List<String>> csvRecords = csvUtilsService.parseCsv(usersCsv, CSV_DELIMITER, CSV_HEADERS);
    List<PreRegisterUserInternalDto> userRequests = csvRecords.stream().map(
      record -> new PreRegisterUserInternalDto(record.get(0).trim(), record.get(1).trim(),
        record.get(2).trim(), parseGroupPermissions(record.get(3).trim()),
        parseProjectPermissions(record.get(4).trim()), parseNullable(record.get(5)),
        parseNullable(record.get(6)), parseNullableBoolean(record.get(7)),
        parseNullableBoolean(record.get(8)))).toList();
    return userRequests;
  }

  private Set<PermissionType> parseGroupPermissions(String permissions) {
    List<String> permissionStrings = Arrays.asList(permissions.split("&"));
    Set<PermissionType> permissionTypes = new HashSet<>();
    permissionTypes.add(PermissionType.GROUP_MEMBER);
    if (permissionStrings.contains(PermissionType.GROUP_ADMIN.name())) {
      permissionTypes.add(PermissionType.GROUP_ADMIN);
    }
    if (permissionStrings.contains(PermissionType.GROUP_EDITOR.name())) {
      permissionTypes.add(PermissionType.GROUP_EDITOR);
    }
    return permissionTypes;
  }

  private Set<PermissionType> parseProjectPermissions(String permissions) {
    List<String> permissionStrings = Arrays.asList(permissions.split("&"));
    Set<PermissionType> permissionTypes = new HashSet<>();
    permissionTypes.add(PermissionType.PROJECT_ASSIGNED_MEMBER);
    if (permissionStrings.contains(PermissionType.PROJECT_ADMIN.name())) {
      permissionTypes.add(PermissionType.PROJECT_ADMIN);
    }
    if (permissionStrings.contains(PermissionType.PROJECT_EDITOR.name())) {
      permissionTypes.add(PermissionType.PROJECT_EDITOR);
    }
    if (permissionStrings.contains(PermissionType.PROJECT_COORDINATOR.name())) {
      permissionTypes.add(PermissionType.PROJECT_COORDINATOR);
    }
    return permissionTypes;
  }

  private String parseNullable(String value) {
    if (value == null || value.isEmpty() || value.equalsIgnoreCase("null")) {
      return null;
    }
    return value.trim();
  }

  private Boolean parseNullableBoolean(String value) {
    if (value == null || value.isEmpty() || value.equalsIgnoreCase("null")) {
      return null;
    }
    return value.equalsIgnoreCase("TRUE");
  }

  private void handlePreRegistrationRequest(
    Long groupId, Long projectId, Long questionnaireId, PreRegisterUserInternalDto userRequest,
    Instant expiresAt, String projectName, Locale locale) {
    VerificationTokenDto verificationTokenDto = null;
    try {
      String email = userRequest.email();
      String username = userRequest.username();
      String fullName = userRequest.fullName();
      verificationTokenService.verifyTokenDoesNotExistWith(email, username);
      verificationTokenDto = verificationTokenService.savePreRegistrationVerificationToken(
        userRequest, groupId, projectId, questionnaireId, expiresAt);
      sendPreRegisterEmail(verificationTokenDto, fullName, email, projectName, locale);
    } catch (Exception e) {
      verificationTokenService.cleanupVerificationToken(verificationTokenDto);
      throw e;
    }
  }

  private void updateExistingUser(
    UserGroup group, Project project, Questionnaire questionnaire, ApplicationUser user,
    PreRegisterUserInternalDto userRequest) {
    group.addMember(user);
    if (userRequest.groupPermissions().contains(PermissionType.GROUP_ADMIN)) {
      group.addAdmin(user);
    }
    if (userRequest.groupPermissions().contains(PermissionType.GROUP_EDITOR)) {
      group.addEditor(user);
    }
    userGroupDao.save(group);

    project.assignMember(user);
    if (userRequest.projectPermissions().contains(PermissionType.PROJECT_ADMIN)) {
      project.addAdmin(user);
    }
    if (userRequest.projectPermissions().contains(PermissionType.PROJECT_EDITOR)) {
      project.addEditor(user);
    }
    if (userRequest.projectPermissions().contains(PermissionType.PROJECT_COORDINATOR)) {
      project.addCoordinator(user);
    }
    projectDao.save(project);

    user.setActiveQuestionnaire(questionnaire);
    user.setEmail(userRequest.email());
    user.setUsername(userRequest.username());
    if (userRequest.coordinatorName() != null) {
      user.setCurrentCoordinatorFullName(userRequest.coordinatorName());
    }
    if (userRequest.hasExternalTestQuestionnaire() != null) {
      user.setHasExternalTestQuestionnaire(userRequest.hasExternalTestQuestionnaire());
    }
    if (userRequest.hasExternalTestFailure() != null) {
      user.setHasExternalTestFailure(userRequest.hasExternalTestFailure());
    }
    applicationUserDao.save(user);
  }

  private void sendPreRegisterEmail(
    VerificationTokenDto tokenDto, String fullName, String email, String projectName,
    Locale locale) {
    try {
      EmailRequestDto emailRequestDto = emailTemplateService.getPreRegisterEmailDto(
        tokenDto, fullName, email, projectName, locale);
      emailService.sendMailToUserAddress(emailRequestDto);
    } catch (IOException e) {
      throw new RuntimeException("Failed to process e-mail template - " + e.getMessage());
    } catch (MessagingException e) {
      throw new RuntimeException("Failed to send e-mail to " + email + " - " + e.getMessage());
    }
  }
}
