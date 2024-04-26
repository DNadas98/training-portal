package net.dnadas.training_portal.service.user;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dnadas.training_portal.dto.email.EmailRequestDto;
import net.dnadas.training_portal.dto.user.CompletionMailReportDto;
import net.dnadas.training_portal.dto.user.CompletionMailUserInternalDto;
import net.dnadas.training_portal.exception.group.project.ProjectNotFoundException;
import net.dnadas.training_portal.model.group.project.Project;
import net.dnadas.training_portal.model.group.project.ProjectDao;
import net.dnadas.training_portal.model.user.ApplicationUser;
import net.dnadas.training_portal.model.user.ApplicationUserDao;
import net.dnadas.training_portal.service.utils.email.EmailService;
import net.dnadas.training_portal.service.utils.email.EmailTemplateService;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CompletionMailService {
  private final ApplicationUserDao applicationUserDao;
  private final ProjectDao projectDao;
  private final EmailTemplateService emailTemplateService;
  private final EmailService emailService;


  public CompletionMailReportDto sendCompletionMails(
    Long groupId, Long projectId) {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId)
      .orElseThrow(() -> new ProjectNotFoundException(projectId));
    List<CompletionMailUserInternalDto> successful = new ArrayList<>();
    Map<CompletionMailUserInternalDto, String> failed = new HashMap<>();
    List<ApplicationUser> usersWithMaxPointSubmissions =
      applicationUserDao.findUsersWithCompletedRequirementsForProject(groupId, projectId);
    for (ApplicationUser user : usersWithMaxPointSubmissions) {
      tryToSendEmail(user, project, successful, failed);
    }
    return new CompletionMailReportDto(usersWithMaxPointSubmissions.size(), successful, failed);
  }

  @Async
  void tryToSendEmail(
    ApplicationUser user, Project project, List<CompletionMailUserInternalDto> successful,
    Map<CompletionMailUserInternalDto, String> failed) {
    try {
      sendCompletionMail(user, project);
      successful.add(
        new CompletionMailUserInternalDto(
          user.getUsername(), user.getFullName(), user.getEmail(),
          user.getCurrentCoordinatorFullName(), user.getHasExternalTestQuestionnaire(),
          user.getHasExternalTestFailure(), user.getReceivedSuccessfulCompletionEmail()));
    } catch (Exception e) {
      log.error(e.getMessage());
      failed.put(
        new CompletionMailUserInternalDto(
          user.getUsername(), user.getFullName(), user.getEmail(),
          user.getCurrentCoordinatorFullName(), user.getHasExternalTestQuestionnaire(),
          user.getHasExternalTestFailure(), user.getReceivedSuccessfulCompletionEmail()),
        e.getMessage());
      user.setReceivedSuccessfulCompletionEmail(false);
      applicationUserDao.save(user);
    }
  }

  private void sendCompletionMail(ApplicationUser user, Project project)
    throws
    IOException, MessagingException {
    EmailRequestDto mailRequest = emailTemplateService.getCompletionEmailDto(
      user, project);
    user.setReceivedSuccessfulCompletionEmail(true);
    applicationUserDao.save(user);
    emailService.sendMailToUserAddress(mailRequest);
  }
}
