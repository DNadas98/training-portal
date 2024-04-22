package net.dnadas.training_portal.service.user;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dnadas.training_portal.dto.auth.PreRegistrationCompleteRequestDto;
import net.dnadas.training_portal.dto.email.EmailRequestDto;
import net.dnadas.training_portal.dto.user.PreRegisterUserInternalDto;
import net.dnadas.training_portal.dto.user.PreRegisterUsersInternalDto;
import net.dnadas.training_portal.dto.user.PreRegisterUsersReportDto;
import net.dnadas.training_portal.dto.user.PreRegistrationCompleteInternalDto;
import net.dnadas.training_portal.dto.verification.VerificationTokenDto;
import net.dnadas.training_portal.exception.auth.UserAlreadyExistsException;
import net.dnadas.training_portal.exception.group.project.questionnaire.QuestionnaireNotFoundException;
import net.dnadas.training_portal.model.auth.ApplicationUser;
import net.dnadas.training_portal.model.auth.ApplicationUserDao;
import net.dnadas.training_portal.model.group.UserGroup;
import net.dnadas.training_portal.model.group.UserGroupDao;
import net.dnadas.training_portal.model.group.project.Project;
import net.dnadas.training_portal.model.group.project.ProjectDao;
import net.dnadas.training_portal.model.group.project.questionnaire.Questionnaire;
import net.dnadas.training_portal.model.group.project.questionnaire.QuestionnaireDao;
import net.dnadas.training_portal.model.verification.PreRegistrationVerificationToken;
import net.dnadas.training_portal.model.verification.PreRegistrationVerificationTokenDao;
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
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class PreRegistrationService {
  private static final Integer MAX_RECEIVED_CSV_SIZE = 400000;
  private static final Integer VERIFICATION_EXPIRATION_DAYS = 60;
  private final ApplicationUserDao applicationUserDao;
  private final UserGroupDao userGroupDao;
  private final ProjectDao projectDao;
  private final QuestionnaireDao questionnaireDao;
  private final VerificationTokenService verificationTokenService;
  private final PreRegistrationVerificationTokenDao preRegistrationVerificationTokenDao;
  private final CsvUtilsService csvUtilsService;
  private final EmailTemplateService emailTemplateService;
  private final EmailService emailService;
  private final PasswordEncoder passwordEncoder;

  @Transactional(rollbackFor = Exception.class)
  @Secured("ADMIN")
  public PreRegisterUsersReportDto preRegisterUsers(
    Long groupId, Long projectId, Long questionnaireId, MultipartFile usersCsv) {
    List<PreRegisterUserInternalDto> updatedUsers = new ArrayList<>();
    List<PreRegisterUserInternalDto> createdUsers = new ArrayList<>();
    Map<PreRegisterUserInternalDto, String> failedUsers = new HashMap<>();

    csvUtilsService.verifyCsv(usersCsv, MAX_RECEIVED_CSV_SIZE);
    PreRegisterUsersInternalDto parsedCsv = csvUtilsService
      .parsePreRegisterUsersRequestCsv(usersCsv);
    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(
      groupId, projectId, questionnaireId).orElseThrow(QuestionnaireNotFoundException::new);
    Project project = questionnaire.getProject();
    UserGroup group = project.getUserGroup();

    List<PreRegisterUserInternalDto> userRequests = parsedCsv.users();
    List<ApplicationUser> existingUsers = applicationUserDao.findAllByEmailIn(
      userRequests.stream().map(PreRegisterUserInternalDto::email).toList());

    userRequests.forEach(userRequest -> {
      try {
        ApplicationUser existingUser = existingUsers.stream().filter(
          user -> user.getEmail().equals(userRequest.email())).findFirst().orElse(null);
        if (existingUser != null) {
          updateExistingUser(group, project, questionnaire, existingUser);
          updatedUsers.add(userRequest);
        } else {
          handlePreRegistrationRequest(groupId, projectId, questionnaireId, userRequest);
          createdUsers.add(userRequest);
        }
      } catch (Exception e) {
        failedUsers.put(userRequest, e.getMessage());
      }
    });
    return new PreRegisterUsersReportDto(
      userRequests.size(), updatedUsers, createdUsers, failedUsers);
  }

  @Transactional(rollbackFor = Exception.class)
  public PreRegistrationCompleteInternalDto completePreRegistration(
    VerificationTokenDto verificationTokenDto, PreRegistrationCompleteRequestDto requestDto) {
    PreRegistrationVerificationToken token =
      (PreRegistrationVerificationToken) verificationTokenService.getVerificationToken(
        verificationTokenDto);
    Optional<ApplicationUser> existingUser = applicationUserDao.findByEmailOrUsername(
      token.getEmail(),
      token.getUsername());
    if (existingUser.isPresent()) {
      throw new UserAlreadyExistsException();
    }
    Optional<UserGroup> group = userGroupDao.findById(token.getGroupId());
    Optional<Project> project = projectDao.findById(token.getProjectId());
    Optional<Questionnaire> questionnaire = questionnaireDao.findById(token.getQuestionnaireId());

    ApplicationUser user = new ApplicationUser(token.getUsername(), token.getEmail(),
      passwordEncoder.encode(requestDto.password()));
    applicationUserDao.save(user);
    if (group.isPresent()) {
      UserGroup foundGroup = group.get();
      foundGroup.addMember(user);
      userGroupDao.save(foundGroup);
      if (project.isPresent() && project.get().getUserGroup().getId().equals(foundGroup.getId())) {
        Project foundProject = project.get();
        foundProject.assignMember(user);
        projectDao.save(foundProject);
        if (questionnaire.isPresent() && questionnaire.get().getProject().getId().equals(
          foundProject.getId())) {
          Questionnaire foundQuestionnaire = questionnaire.get();
          user.setActiveQuestionnaire(foundQuestionnaire);
          applicationUserDao.save(user);
        }
      }
    }
    verificationTokenService.deleteVerificationToken(token.getId());
    return new PreRegistrationCompleteInternalDto(user.getEmail());
  }

  private void handlePreRegistrationRequest(
    Long groupId, Long projectId, Long questionnaireId, PreRegisterUserInternalDto userRequest) {
    PreRegistrationVerificationToken token = null;
    try {
      UUID verificationCode = UUID.randomUUID();
      String hashedVerificationCode = verificationTokenService.getHashedVerificationCode(
        verificationCode);
      //TODO: get expiration date from frontend request
      Instant expiresAt = Instant.now().plusSeconds(60L * 60 * 24 * VERIFICATION_EXPIRATION_DAYS);
      token = preRegistrationVerificationTokenDao.save(new PreRegistrationVerificationToken(
        userRequest.email(), userRequest.username(), groupId, projectId, questionnaireId,
        hashedVerificationCode, expiresAt));
      if (token == null) {
        throw new RuntimeException("Failed to create verification token");
      }
      sendPreRegisterEmail(
        new VerificationTokenDto(token.getId(), verificationCode), userRequest.username(),
        userRequest.email());
    } catch (Exception e) {
      if (token != null) {
        verificationTokenService.deleteVerificationToken(token.getId());
      }
      throw e;
    }
  }

  private void updateExistingUser(
    UserGroup group, Project project, Questionnaire questionnaire, ApplicationUser user) {
    group.addMember(user);
    userGroupDao.save(group);
    project.assignMember(user);
    projectDao.save(project);
    user.setActiveQuestionnaire(questionnaire);
    applicationUserDao.save(user);
  }

  private void sendPreRegisterEmail(
    VerificationTokenDto tokenDto, String username, String email) {
    try {
      EmailRequestDto emailRequestDto = emailTemplateService.getPreRegisterEmailDto(
        tokenDto, username, email);
      emailService.sendMailToUserAddress(emailRequestDto);
    } catch (IOException e) {
      throw new RuntimeException("Failed to process e-mail template - " + e.getMessage());
    } catch (MessagingException e) {
      throw new RuntimeException("Failed to send e-mail to " + email + " - " + e.getMessage());
    }
  }
}
