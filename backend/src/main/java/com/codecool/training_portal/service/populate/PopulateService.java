package com.codecool.training_portal.service.populate;

import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.ApplicationUserDao;
import com.codecool.training_portal.model.company.Company;
import com.codecool.training_portal.model.company.CompanyDao;
import com.codecool.training_portal.model.company.project.Project;
import com.codecool.training_portal.model.company.project.ProjectDao;
import com.codecool.training_portal.model.company.project.task.Importance;
import com.codecool.training_portal.model.company.project.task.Task;
import com.codecool.training_portal.model.company.project.task.TaskDao;
import com.codecool.training_portal.model.company.project.task.TaskStatus;
import com.codecool.training_portal.model.company.project.task.expense.Expense;
import com.codecool.training_portal.model.company.project.task.expense.ExpenseDao;
import com.codecool.training_portal.model.request.CompanyJoinRequest;
import com.codecool.training_portal.model.request.CompanyJoinRequestDao;
import com.codecool.training_portal.model.request.ProjectJoinRequest;
import com.codecool.training_portal.model.request.ProjectJoinRequestDao;
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
  private final CompanyDao companyDao;
  private final CompanyJoinRequestDao companyJoinRequestDao;
  private final ProjectDao projectDao;
  private final ProjectJoinRequestDao projectJoinRequestDao;
  private final TaskDao taskDao;
  private final ExpenseDao expenseDao;

  @Value("${BACKEND_DEFAULT_ADMIN_USERNAME}")
  private String DEFAULT_ADMIN_USERNAME;


  @PostConstruct
  @Transactional(rollbackFor = Exception.class)
  public void populate() {
    List<ApplicationUser> testUsers = createApplicationUsers(5);
    Company company = new Company("Test company 1", "Test company 1 description", testUsers.get(0));
    company.addEmployee(testUsers.get(1));
    company.addEditor(testUsers.get(1));
    company.addEmployee(testUsers.get(2));
    company.addEmployee(testUsers.get(3));
    companyDao.save(company);
    companyJoinRequestDao.save(new CompanyJoinRequest(company, testUsers.get(4)));

    Project project = new Project("Test project 1", "Test project 1 description", Instant.now(),
      Instant.now().plusSeconds(60 * 60), testUsers.get(0), company);
    project.addEditor(testUsers.get(1));
    project.assignEmployee(testUsers.get(2));
    projectDao.save(project);
    projectJoinRequestDao.save(new ProjectJoinRequest(project, testUsers.get(3)));

    Task task = new Task("Test task 1", "Test task 1 description", Importance.NICE_TO_HAVE, 3,
      Instant.now(), Instant.now().plusSeconds(60 * 60), TaskStatus.IN_PROGRESS, project,
      testUsers.get(0));
    task.assignEmployee(testUsers.get(1));
    task.assignEmployee(testUsers.get(2));
    taskDao.save(task);

    expenseDao.save(new Expense("Test expense 1", 11.1111, false, task));
    expenseDao.save(new Expense("Test expense 2", 25.2525, false, task));

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
