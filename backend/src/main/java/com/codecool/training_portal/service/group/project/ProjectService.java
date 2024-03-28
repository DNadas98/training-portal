package com.codecool.training_portal.service.group.project;

import com.codecool.training_portal.dto.group.project.ProjectCreateRequestDto;
import com.codecool.training_portal.dto.group.project.ProjectResponsePrivateDTO;
import com.codecool.training_portal.dto.group.project.ProjectResponsePublicDTO;
import com.codecool.training_portal.dto.group.project.ProjectUpdateRequestDto;
import com.codecool.training_portal.exception.auth.UnauthorizedException;
import com.codecool.training_portal.exception.group.GroupNotFoundException;
import com.codecool.training_portal.exception.group.project.ProjectNotFoundException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.UserGroup;
import com.codecool.training_portal.model.group.UserGroupDao;
import com.codecool.training_portal.model.group.project.Project;
import com.codecool.training_portal.model.group.project.ProjectDao;
import com.codecool.training_portal.model.group.project.task.Task;
import com.codecool.training_portal.model.request.RequestStatus;
import com.codecool.training_portal.service.auth.CustomPermissionEvaluator;
import com.codecool.training_portal.service.auth.UserProvider;
import com.codecool.training_portal.service.converter.ProjectConverter;
import com.codecool.training_portal.service.datetime.DateTimeService;
import lombok.RequiredArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {
  private final ProjectDao projectDao;
  private final UserGroupDao userGroupDao;
  private final ProjectConverter projectConverter;
  private final UserProvider userProvider;
  private final DateTimeService dateTimeService;
  private final CustomPermissionEvaluator customPermissionEvaluator;

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_MEMBER')")
  public List<ProjectResponsePublicDTO> getProjectsWithoutUser(Long groupId)
    throws UnauthorizedException {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    if (customPermissionEvaluator.hasGroupEditorAccess(applicationUser.getId(), userGroup)
      || customPermissionEvaluator.hasGroupAdminAccess(applicationUser.getId(), userGroup)) {
      return new ArrayList<>();
    }
    List<Project> projects = projectDao.findAllWithoutMemberAndJoinRequestInGroup(
      applicationUser, List.of(RequestStatus.PENDING, RequestStatus.DECLINED), userGroup);
    return projectConverter.getProjectResponsePublicDtos(projects);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_MEMBER')")
  public List<ProjectResponsePublicDTO> getProjectsWithUser(Long groupId)
    throws UnauthorizedException {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    final List<Project> projects;
    if (customPermissionEvaluator.hasGroupEditorAccess(applicationUser.getId(), userGroup)
      || customPermissionEvaluator.hasGroupAdminAccess(applicationUser.getId(), userGroup)) {
      projects = projectDao.findAllByUserGroup(userGroup);
    } else {
      projects = projectDao.findAllWithMemberAndGroup(applicationUser, userGroup);
    }
    return projectConverter.getProjectResponsePublicDtos(projects);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public ProjectResponsePrivateDTO getProjectById(Long groupId, Long projectId)
    throws UnauthorizedException {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    return projectConverter.getProjectResponsePrivateDto(project);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_ADMIN')")
  public ProjectResponsePrivateDTO createProject(
    ProjectCreateRequestDto createRequestDto, Long groupId) throws ConstraintViolationException {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));

    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();

    Instant projectStartDate = dateTimeService.toStoredDate(createRequestDto.startDate());
    Instant projectDeadline = dateTimeService.toStoredDate(createRequestDto.deadline());
    dateTimeService.validateProjectDates(projectStartDate, projectDeadline);

    Project project = new Project(createRequestDto.name(), createRequestDto.description(),
      projectStartDate, projectDeadline, applicationUser, userGroup);
    projectDao.save(project);
    return projectConverter.getProjectResponsePrivateDto(project);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public ProjectResponsePrivateDTO updateProject(
    ProjectUpdateRequestDto updateRequestDto, Long groupId, Long projectId)
    throws ConstraintViolationException {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));

    Instant projectStartDate = dateTimeService.toStoredDate(updateRequestDto.startDate());
    Instant projectDeadline = dateTimeService.toStoredDate(updateRequestDto.deadline());
    List<Task> tasks = project.getTasks();
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
  public void deleteProject(Long groupId, Long projectId) {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(() ->
      new ProjectNotFoundException(projectId));
    projectDao.delete(project);
  }
}
