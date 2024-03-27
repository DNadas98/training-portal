package com.codecool.training_portal.service.populate;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.ApplicationUserDao;
import com.codecool.training_portal.model.group.UserGroup;
import com.codecool.training_portal.model.group.UserGroupDao;
import com.codecool.training_portal.model.group.project.Project;
import com.codecool.training_portal.model.group.project.ProjectDao;
import com.codecool.training_portal.model.group.project.questionnaire.*;
import com.codecool.training_portal.model.group.project.task.Importance;
import com.codecool.training_portal.model.group.project.task.Task;
import com.codecool.training_portal.model.group.project.task.TaskDao;
import com.codecool.training_portal.model.group.project.task.TaskStatus;
import com.codecool.training_portal.model.request.ProjectJoinRequest;
import com.codecool.training_portal.model.request.ProjectJoinRequestDao;
import com.codecool.training_portal.model.request.UserGroupJoinRequest;
import com.codecool.training_portal.model.request.UserGroupJoinRequestDao;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
      "Test group 1", "Test group 1 description", testUsers.get(0));
    userGroup.addMember(testUsers.get(1));
    userGroup.addEditor(testUsers.get(1));
    userGroup.addMember(testUsers.get(2));
    userGroup.addMember(testUsers.get(3));
    userGroupDao.save(userGroup);
    userGroupJoinRequestDao.save(new UserGroupJoinRequest(userGroup, testUsers.get(4)));

    Project project = new Project("Test project 1", "Test project 1 description", Instant.now(),
      Instant.now().plusSeconds(60 * 60), testUsers.get(0), userGroup);
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
    Questionnaire questionnaire = new Questionnaire("Test questionnaire 1", "Test questionnaire 1 description",
      project, testUsers.get(0));
    Question question1 = new Question("Test question 1", QuestionType.RADIO,1,1, questionnaire);
    Answer answer1 = new Answer("Test answer 1",true,1, question1);
    question1.addAnswer(answer1);
    Answer answer2 = new Answer("Test answer 2",false,2, question1);
    question1.addAnswer(answer2);
    Answer answer3 = new Answer("Test answer 3",false,3, question1);
    question1.addAnswer(answer3);
    questionnaire.addQuestion(question1);

    Question question2 = new Question("Test question 2", QuestionType.CHECKBOX,2,2, questionnaire);
    Answer answer4 = new Answer("Test answer 4",true,1, question2);
    question2.addAnswer(answer4);
    Answer answer5 = new Answer("Test answer 5",false,2, question2);
    question2.addAnswer(answer5);
    Answer answer6 = new Answer("Test answer 6",true,3, question2);
    question2.addAnswer(answer6);
    questionnaire.addQuestion(question2);
    return questionnaire;
  }

  private List<ApplicationUser> createApplicationUsers(int i) {
    List<ApplicationUser> users = new ArrayList<>();
    for (int j = 1; j <= i; j++) {
      ApplicationUser applicationUser = applicationUserDao.save(
        new ApplicationUser("Dev User " + j, "user" + j + "@test.test",
          passwordEncoder.encode("devuser" + j + "newPassword")));
      users.add(applicationUser);
    }
    return users;
  }
}
