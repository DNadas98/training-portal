package net.dnadas.training_portal.service.group.project;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.project.ProjectCreateRequestDto;
import net.dnadas.training_portal.dto.group.project.ProjectResponsePrivateDTO;
import net.dnadas.training_portal.dto.group.project.ProjectResponsePublicDTO;
import net.dnadas.training_portal.dto.group.project.ProjectUpdateRequestDto;
import net.dnadas.training_portal.exception.auth.UnauthorizedException;
import net.dnadas.training_portal.exception.group.GroupNotFoundException;
import net.dnadas.training_portal.exception.group.project.ProjectNotFoundException;
import net.dnadas.training_portal.model.auth.GlobalRole;
import net.dnadas.training_portal.model.auth.PermissionType;
import net.dnadas.training_portal.model.group.UserGroup;
import net.dnadas.training_portal.model.group.UserGroupDao;
import net.dnadas.training_portal.model.group.project.Project;
import net.dnadas.training_portal.model.group.project.ProjectDao;
import net.dnadas.training_portal.model.group.project.task.Task;
import net.dnadas.training_portal.model.request.RequestStatus;
import net.dnadas.training_portal.model.user.ApplicationUser;
import net.dnadas.training_portal.service.auth.CustomPermissionEvaluator;
import net.dnadas.training_portal.service.user.UserProvider;
import net.dnadas.training_portal.service.utils.converter.ProjectConverter;
import net.dnadas.training_portal.service.utils.datetime.DateTimeService;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_ADMIN')")
  public List<ProjectResponsePublicDTO> getAllProjectsOfGroup(Long groupId) {
    UserGroup userGroup = userGroupDao.findById(groupId).orElseThrow(
      () -> new GroupNotFoundException(groupId));
    List<Project> projects = projectDao.findAllByUserGroup(userGroup);
    return projectConverter.getProjectResponsePublicDtos(projects);
  }

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
  public ProjectResponsePrivateDTO getProjectDetailsById(Long groupId, Long projectId)
    throws UnauthorizedException {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    return projectConverter.getProjectResponsePrivateDto(project);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public ProjectResponsePublicDTO getProjectById(Long groupId, Long projectId)
    throws UnauthorizedException {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    return projectConverter.getProjectResponsePublicDto(project);
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
    String detailedDescription = createRequestDto.detailedDescription();
    Project project = new Project(createRequestDto.name(), createRequestDto.description(),
      detailedDescription,
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
    String detailedDescription = updateRequestDto.detailedDescription();
    project.setDetailedDescription(detailedDescription);
    project.setStartDate(projectStartDate);
    project.setDeadline(projectDeadline);
    ApplicationUser user = userProvider.getAuthenticatedUser();
    project.setUpdatedBy(user);
    project.setUpdatedAt(Instant.now());
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

  @Transactional(readOnly = true)
  public Set<PermissionType> getUserPermissionsForProject(Long groupId, Long projectId) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));

    if (user.getGlobalRoles().contains(GlobalRole.ADMIN)) {
      return Set.of(PermissionType.PROJECT_ASSIGNED_MEMBER, PermissionType.PROJECT_EDITOR,
        PermissionType.PROJECT_COORDINATOR, PermissionType.PROJECT_ADMIN);
    }

    Set<PermissionType> permissions = new HashSet<>();
    permissions.add(PermissionType.PROJECT_ASSIGNED_MEMBER);
    if (customPermissionEvaluator.hasProjectEditorAccess(user.getId(), project)) {
      permissions.add(PermissionType.PROJECT_EDITOR);
    }
    if (customPermissionEvaluator.hasProjectCoordinatorAccess(user.getId(), project)) {
      permissions.add(PermissionType.PROJECT_COORDINATOR);
    }
    if (customPermissionEvaluator.hasProjectAdminAccess(user.getId(), project)) {
      permissions.add(PermissionType.PROJECT_ADMIN);
    }
    return permissions;
  }
}
