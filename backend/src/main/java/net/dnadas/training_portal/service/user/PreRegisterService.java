package net.dnadas.training_portal.service.user;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dnadas.training_portal.model.auth.ApplicationUserDao;
import net.dnadas.training_portal.model.group.UserGroupDao;
import net.dnadas.training_portal.model.group.project.ProjectDao;
import net.dnadas.training_portal.model.group.project.questionnaire.QuestionnaireDao;
import net.dnadas.training_portal.service.utils.csv.CsvUtilsService;
import net.dnadas.training_portal.service.verification.VerificationTokenService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class PreRegisterService {
  private final ApplicationUserDao applicationUserDao;
  private final UserGroupDao userGroupDao;
  private final ProjectDao projectDao;
  private final QuestionnaireDao questionnaireDao;
  private final VerificationTokenService verificationTokenService;
  private final CsvUtilsService csvUtilsService;

  public void preRegisterUsers(
    Long groupId, Long projectId, Long questionnaireId, MultipartFile usersCsv) {
    //TODO: impl
    return;
  }
}
