package net.dnadas.training_portal.service.populate;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dnadas.training_portal.model.auth.ApplicationUser;
import net.dnadas.training_portal.model.auth.ApplicationUserDao;
import net.dnadas.training_portal.model.group.UserGroup;
import net.dnadas.training_portal.model.group.UserGroupDao;
import net.dnadas.training_portal.model.group.project.Project;
import net.dnadas.training_portal.model.group.project.ProjectDao;
import net.dnadas.training_portal.model.group.project.questionnaire.*;
import net.dnadas.training_portal.model.group.project.task.Importance;
import net.dnadas.training_portal.model.group.project.task.Task;
import net.dnadas.training_portal.model.group.project.task.TaskDao;
import net.dnadas.training_portal.model.group.project.task.TaskStatus;
import net.dnadas.training_portal.model.request.ProjectJoinRequest;
import net.dnadas.training_portal.model.request.ProjectJoinRequestDao;
import net.dnadas.training_portal.model.request.UserGroupJoinRequest;
import net.dnadas.training_portal.model.request.UserGroupJoinRequestDao;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Profile("dev")
@Service
@Slf4j
@RequiredArgsConstructor
public class PopulateService {
  private final static String EXAMPLE_DATA_POPULATED_MESSAGE = "" +
    "<pre><code>" +
    " _____ _____ _____ _____ <br/>" +
    "|_   _|  ___/  ___|_   _|<br/>" +
    "  | | | |__ \\ `--.  | |  <br/>" + // Escaped the backslash before the `
    "  | | |  __| `--. \\ | |  <br/>" + // Escaped the backslash before the |
    "  | | | |___/\\__/ / | |  <br/>" + // Escaped the backslashes before / and |
    "  \\_/ \\____/\\____/  \\_/  " + // Escaped all backslashes
    "</code></pre>";
  private final ApplicationUserDao applicationUserDao;
  private final PasswordEncoder passwordEncoder;
  private final UserGroupDao userGroupDao;
  private final UserGroupJoinRequestDao userGroupJoinRequestDao;
  private final ProjectDao projectDao;
  private final ProjectJoinRequestDao projectJoinRequestDao;
  private final TaskDao taskDao;
  private final QuestionnaireDao questionnaireDao;

  @PostConstruct
  @Transactional(rollbackFor = Exception.class)
  public void populate() {
    List<ApplicationUser> testUsers = createApplicationUsers(5);
    UserGroup userGroup = new UserGroup(
      "Test group 1", "Test group 1 description",
      EXAMPLE_DATA_POPULATED_MESSAGE,
      testUsers.get(0));
    userGroup.addMember(testUsers.get(1));
    userGroup.addEditor(testUsers.get(1));
    userGroup.addMember(testUsers.get(2));
    userGroup.addMember(testUsers.get(3));
    userGroupDao.save(userGroup);
    userGroupJoinRequestDao.save(new UserGroupJoinRequest(userGroup, testUsers.get(4)));

    Project project = new Project("Test project 1", "Test project 1 description",
      EXAMPLE_DATA_POPULATED_MESSAGE,
      Instant.now(), Instant.now().plusSeconds(60 * 60), testUsers.get(0), userGroup);
    project.assignMember(testUsers.get(1));
    project.addEditor(testUsers.get(1));
    project.assignMember(testUsers.get(2));
    projectDao.save(project);
    projectJoinRequestDao.save(new ProjectJoinRequest(project, testUsers.get(3)));

    Task task = new Task("Test task 1", "Test task 1 description", Importance.NICE_TO_HAVE, 3,
      Instant.now(), Instant.now().plusSeconds(60 * 60), TaskStatus.IN_PROGRESS, project,
      testUsers.get(0));
    task.assignMember(testUsers.get(1));
    task.assignMember(testUsers.get(2));
    taskDao.save(task);

    Questionnaire questionnaire =
      createQuestionnaire(project, testUsers);
    questionnaire.setStatus(QuestionnaireStatus.ACTIVE);
    questionnaireDao.save(questionnaire);

    log.info("Database has been populated with example data successfully");
  }

  private Questionnaire createQuestionnaire(Project project, List<ApplicationUser> testUsers) {
    Questionnaire questionnaire = new Questionnaire("Test questionnaire 1",
      EXAMPLE_DATA_POPULATED_MESSAGE,
      project, testUsers.get(0));
    for (int i = 0; i < 5; i++) {
      Question question = new Question(
        EXAMPLE_DATA_POPULATED_MESSAGE, QuestionType.RADIO, i + 1, 1, questionnaire);
      Answer answer1 = new Answer("Test answer " + i + " - 1", true, 1, question);
      question.addAnswer(answer1);
      Answer answer2 = new Answer("Test answer " + i + " - 2", false, 2, question);
      question.addAnswer(answer2);
      Answer answer3 = new Answer("Test answer " + i + " - 3", false, 3, question);
      question.addAnswer(answer3);
      questionnaire.addQuestion(question);
    }
    return questionnaire;
  }

  private List<ApplicationUser> createApplicationUsers(int i) {
    List<ApplicationUser> users = new ArrayList<>();
    for (int j = 1; j <= i; j++) {
      ApplicationUser applicationUser = applicationUserDao.save(
        new ApplicationUser("Dev User " + j, "user" + j + "@test.test",
          passwordEncoder.encode("devuser" + j + "password")));
      users.add(applicationUser);
    }
    return users;
  }
}
