package com.codecool.training_portal.service.company.project;

import com.codecool.training_portal.dto.company.project.ProjectCreateRequestDto;
import com.codecool.training_portal.dto.company.project.ProjectResponsePrivateDTO;
import com.codecool.training_portal.dto.company.project.ProjectResponsePublicDTO;
import com.codecool.training_portal.dto.company.project.ProjectUpdateRequestDto;
import com.codecool.training_portal.exception.auth.UnauthorizedException;
import com.codecool.training_portal.exception.company.CompanyNotFoundException;
import com.codecool.training_portal.exception.company.project.ProjectNotFoundException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.company.Company;
import com.codecool.training_portal.model.company.CompanyDao;
import com.codecool.training_portal.model.company.project.Project;
import com.codecool.training_portal.model.company.project.ProjectDao;
import com.codecool.training_portal.model.company.project.task.Task;
import com.codecool.training_portal.model.request.RequestStatus;
import com.codecool.training_portal.service.auth.UserProvider;
import com.codecool.training_portal.service.converter.ProjectConverter;
import com.codecool.training_portal.service.datetime.DateTimeService;
import lombok.RequiredArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProjectService {
  private final ProjectDao projectDao;
  private final CompanyDao companyDao;
  private final ProjectConverter projectConverter;
  private final UserProvider userProvider;
  private final DateTimeService dateTimeService;

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#companyId, 'Company', 'COMPANY_EMPLOYEE')")
  public List<ProjectResponsePublicDTO> getProjectsWithoutUser(Long companyId)
    throws UnauthorizedException {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    Company company = companyDao.findById(companyId).orElseThrow(
      () -> new CompanyNotFoundException(companyId));
    List<Project> projects = projectDao.findAllWithoutEmployeeAndJoinRequestInCompany(
      applicationUser, List.of(RequestStatus.PENDING, RequestStatus.DECLINED), company);
    return projectConverter.getProjectResponsePublicDtos(projects);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#companyId, 'Company', 'COMPANY_EMPLOYEE')")
  public List<ProjectResponsePublicDTO> getProjectsWithUser(Long companyId)
    throws UnauthorizedException {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    Company company = companyDao.findById(companyId).orElseThrow(
      () -> new CompanyNotFoundException(companyId));
    List<Project> projects = projectDao.findAllWithEmployeeAndCompany(applicationUser, company);
    return projectConverter.getProjectResponsePublicDtos(projects);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_EMPLOYEE')")
  public ProjectResponsePrivateDTO getProjectById(Long companyId, Long projectId)
    throws UnauthorizedException {
    Project project = projectDao.findByIdAndCompanyId(projectId, companyId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    return projectConverter.getProjectResponsePrivateDto(project);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#companyId, 'Company', 'COMPANY_EMPLOYEE')")
  public ProjectResponsePrivateDTO createProject(
    ProjectCreateRequestDto createRequestDto, Long companyId) throws ConstraintViolationException {
    Company company = companyDao.findById(companyId).orElseThrow(
      () -> new CompanyNotFoundException(companyId));

    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();

    Instant projectStartDate = dateTimeService.toStoredDate(createRequestDto.startDate());
    Instant projectDeadline = dateTimeService.toStoredDate(createRequestDto.deadline());
    dateTimeService.validateProjectDates(projectStartDate, projectDeadline);

    Project project = new Project(createRequestDto.name(), createRequestDto.description(),
      projectStartDate, projectDeadline, applicationUser, company);
    projectDao.save(project);
    return projectConverter.getProjectResponsePrivateDto(project);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public ProjectResponsePrivateDTO updateProject(
    ProjectUpdateRequestDto updateRequestDto, Long companyId, Long projectId)
    throws ConstraintViolationException {
    Project project = projectDao.findByIdAndCompanyId(projectId, companyId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));

    Instant projectStartDate = dateTimeService.toStoredDate(updateRequestDto.startDate());
    Instant projectDeadline = dateTimeService.toStoredDate(updateRequestDto.deadline());
    Set<Task> tasks = project.getTasks();
    if (tasks.isEmpty()) {
      dateTimeService.validateProjectDates(projectStartDate, projectDeadline);
    } else {
      Instant earliestTaskStartDate = dateTimeService.getEarliestTaskStartDate(tasks);
      Instant latestTaskDeadline = dateTimeService.getLatestTaskDeadline(tasks);
      dateTimeService.validateProjectDates(projectStartDate, projectDeadline, earliestTaskStartDate,
        latestTaskDeadline);
    }

    project.setName(updateRequestDto.name());
    project.setDescription(updateRequestDto.description());
    project.setStartDate(projectStartDate);
    project.setDeadline(projectDeadline);
    Project savedProject = projectDao.save(project);
    return projectConverter.getProjectResponsePrivateDto(savedProject);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public void deleteProject(Long companyId, Long projectId) {
    Project project = projectDao.findByIdAndCompanyId(projectId, companyId).orElseThrow(() ->
      new ProjectNotFoundException(projectId));
    projectDao.delete(project);
  }
}
