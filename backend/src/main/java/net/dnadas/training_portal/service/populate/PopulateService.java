package net.dnadas.training_portal.service.populate;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dnadas.training_portal.model.group.UserGroup;
import net.dnadas.training_portal.model.group.UserGroupDao;
import net.dnadas.training_portal.model.group.project.Project;
import net.dnadas.training_portal.model.group.project.ProjectDao;
import net.dnadas.training_portal.model.group.project.questionnaire.*;
/* import net.dnadas.training_portal.model.group.project.task.TaskDao;
import net.dnadas.training_portal.model.group.project.task.Importance;
import net.dnadas.training_portal.model.group.project.task.Task;
import net.dnadas.training_portal.model.group.project.task.TaskStatus; */
import net.dnadas.training_portal.model.user.ApplicationUser;
import net.dnadas.training_portal.model.user.ApplicationUserDao;
import net.dnadas.training_portal.service.user.DefaultAdminInitializer;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

@Service
@Slf4j
@RequiredArgsConstructor
public class PopulateService {
  // ------------------------------------------------------------------------------------------------
  private final static String EXAMPLE_DATA_POPULATED_MESSAGE = "Teszt";
  private final static int QUESTIONNAIRE_QUESTIONS_COUNT = 10;
  private final static int QUESTIONNAIRE_ANSWERS_COUNT = 4;
  private final static int TEST_MEMBERS_COUNT = 500;
  private final static int MEMBER_SUBMISSIONS_COUNT = 1;
  private final static int TEST_EDITORS_COUNT = 10;
  private final static int EDITOR_SUBMISSIONS_COUNT = 20;
  // ------------------------------------------------------------------------------------------------
  private final ApplicationUserDao applicationUserDao;
  private final PasswordEncoder passwordEncoder;
  private final UserGroupDao userGroupDao;
  private final ProjectDao projectDao;
  // private final TaskDao taskDao;
  private final QuestionnaireDao questionnaireDao;
  private final QuestionnaireSubmissionDao questionnaireSubmissionDao;
  private final DefaultAdminInitializer defaultAdminInitializer;

  @PostConstruct
  @Transactional(rollbackFor = Exception.class)
  public void populate() {
    defaultAdminInitializer.createDefaultSystemAdministratorAccount();

    if (applicationUserDao.count() > 1) {
      log.info("Database has already been populated with example data");
      return;
    }
    log.info("Database population with example data is in progress...");

    List<ApplicationUser> testUsers = createApplicationUsers();
    List<ApplicationUser> testEditors = createEditors();
    UserGroup userGroup = new UserGroup(
      "Test group 1", "Test group 1 description",
      EXAMPLE_DATA_POPULATED_MESSAGE,
      testUsers.get(0));
    userGroup.setMembers(testUsers);
    userGroup.setEditors(testEditors);
    userGroupDao.save(userGroup);

    Project project = new Project("Test project 1", "Test project 1 description",
      EXAMPLE_DATA_POPULATED_MESSAGE,
      Instant.now(), Instant.now().plusSeconds(60 * 60), testUsers.get(0), userGroup);
    project.setAssignedMembers(testUsers);
    project.setEditors(testEditors);
    projectDao.save(project);

    /* Task task = new Task("Test task 1", "Test task 1 description", Importance.NICE_TO_HAVE, 3,
      Instant.now(), Instant.now().plusSeconds(60 * 60), TaskStatus.IN_PROGRESS, project,
      testUsers.get(0));
    task.assignMember(testUsers.get(1));
    task.assignMember(testUsers.get(2));
    taskDao.save(task); */

    Questionnaire questionnaire =
      createQuestionnaire(
        project, testUsers, QUESTIONNAIRE_QUESTIONS_COUNT, QUESTIONNAIRE_ANSWERS_COUNT);
    questionnaire.setStatus(QuestionnaireStatus.ACTIVE);
    questionnaireDao.save(questionnaire);

    populateUserQuestionnaireSubmissions(testUsers, questionnaire);

    populateEditorQuestionnaireSubmissions(testEditors, questionnaire);

    log.info("Database has been populated with example data successfully");
  }

  private void populateEditorQuestionnaireSubmissions(
    List<ApplicationUser> testEditors, Questionnaire questionnaire) {
    testEditors.parallelStream().forEach(u -> IntStream.range(0, EDITOR_SUBMISSIONS_COUNT)
      .parallel().forEach(i -> {
        QuestionnaireSubmission qs = new QuestionnaireSubmission(
          questionnaire,
          u, QuestionnaireStatus.TEST);
        QuestionnaireSubmission processed = createSubmittedQuestionsAndAnswers(questionnaire, qs);
        questionnaireSubmissionDao.save(processed);
      }));
  }

  private QuestionnaireSubmission createSubmittedQuestionsAndAnswers(
    Questionnaire questionnaire, QuestionnaireSubmission qs) {
    qs.setSubmittedQuestions(questionnaire.getQuestions().stream()
      .map(
        q -> {
          SubmittedQuestion sq = new SubmittedQuestion(q.getText(), q.getType(),
            q.getQuestionOrder(), q.getPoints(), 0, qs);
          sq.setSubmittedAnswers(q.getAnswers().stream()
            .map(a -> new SubmittedAnswer(a.getText(), a.getAnswerOrder(),
              a.getAnswerOrder().equals(2) ? SubmittedAnswerStatus.INCORRECT :
                SubmittedAnswerStatus.UNCHECKED, sq))
            .toList());
          return sq;
        }).toList());
    qs.setMaxPoints(QUESTIONNAIRE_QUESTIONS_COUNT);
    qs.setReceivedPoints(QUESTIONNAIRE_QUESTIONS_COUNT);
    return qs;
  }

  private void populateUserQuestionnaireSubmissions(
    List<ApplicationUser> testUsers, Questionnaire questionnaire) {
    testUsers.parallelStream().forEach(u -> IntStream.range(0, MEMBER_SUBMISSIONS_COUNT).parallel()
      .forEach(i -> {
        QuestionnaireSubmission qs = new QuestionnaireSubmission(
          questionnaire,
          u, QuestionnaireStatus.ACTIVE);
        createSubmittedQuestionsAndAnswers(questionnaire, qs);
        questionnaireSubmissionDao.save(qs);
      }));
  }

  private Questionnaire createQuestionnaire(
    Project project, List<ApplicationUser> testUsers, int questions, int answers) {
    Questionnaire questionnaire = new Questionnaire("Test questionnaire 1",
      EXAMPLE_DATA_POPULATED_MESSAGE,
      project, testUsers.get(0));
    for (int i = 0; i < questions; i++) {
      Question question = new Question(
        EXAMPLE_DATA_POPULATED_MESSAGE, QuestionType.RADIO, i + 1, 1, questionnaire);
      for (int j = 0; j < answers; j++) {
        Answer answer = new Answer("Test answer " + i + " - " + j, j == 0, j + 1, question);
        question.addAnswer(answer);
      }
      questionnaire.addQuestion(question);
    }
    return questionnaire;
  }

  private List<ApplicationUser> createApplicationUsers() {
    List<ApplicationUser> users = new ArrayList<>();
    IntStream.range(0, TEST_MEMBERS_COUNT).parallel().forEach(index -> {
      ApplicationUser applicationUser = new ApplicationUser(
        getUsername("testUser", index, TEST_MEMBERS_COUNT),
        "user" + index + "@test.test",
        passwordEncoder.encode("testuser" + index + "password"),
        "Test User " + index);
      ApplicationUser savedUser = applicationUserDao.save(applicationUser);
      synchronized (users) {
        users.add(savedUser);
      }
    });
    return users;
  }

  private List<ApplicationUser> createEditors() {
    List<ApplicationUser> users = new ArrayList<>();
    IntStream.range(0, TEST_EDITORS_COUNT).parallel().forEach(index -> {
      ApplicationUser applicationUser = new ApplicationUser(
        getUsername("testEditor", index, TEST_EDITORS_COUNT),
        "editor" + index + "@test.test",
        passwordEncoder.encode("testeditor" + index + "password"),
        "Test Editor " + index);
      ApplicationUser savedUser = applicationUserDao.save(applicationUser);
      synchronized (users) {
        users.add(savedUser);
      }
    });
    return users;
  }

  private String getUsername(String prefix, long index, long maxIndex) {
    int totalDigits = String.valueOf(maxIndex).length();
    return prefix + String.format("%0" + totalDigits + "d", index);
  }
}