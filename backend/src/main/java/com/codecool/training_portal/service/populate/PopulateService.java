package com.codecool.training_portal.service.populate;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.ApplicationUserDao;
import com.codecool.training_portal.model.group.UserGroup;
import com.codecool.training_portal.model.group.UserGroupDao;
import com.codecool.training_portal.model.group.project.Project;
import com.codecool.training_portal.model.group.project.ProjectDao;
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
import org.springframework.beans.factory.annotation.Value;
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

  @PostConstruct
  @Transactional(rollbackFor = Exception.class)
  public void populate() {
    List<ApplicationUser> testUsers = createApplicationUsers(5);
      UserGroup userGroup = new UserGroup("Test group 1", "Test group 1 description", testUsers.get(0));
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

    log.info("Database has been populated with example data successfully");
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
