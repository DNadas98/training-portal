package net.dnadas.training_portal.service.group.project;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.user.UserResponseWithPermissionsDto;
import net.dnadas.training_portal.dto.user.UserResponseWithProjectAndGroupPermissionsInternalDto;
import net.dnadas.training_portal.exception.auth.UserNotFoundException;
import net.dnadas.training_portal.exception.group.project.ProjectNotFoundException;
import net.dnadas.training_portal.model.auth.PermissionType;
import net.dnadas.training_portal.model.group.UserGroup;
import net.dnadas.training_portal.model.group.project.Project;
import net.dnadas.training_portal.model.group.project.ProjectDao;
import net.dnadas.training_portal.model.user.ApplicationUser;
import net.dnadas.training_portal.model.user.ApplicationUserDao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectAdminService {
  private final ProjectDao projectDao;
  private final ApplicationUserDao applicationUserDao;

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public Page<UserResponseWithPermissionsDto> getAssignedMembers(
    Long groupId, Long projectId,
    Pageable pageable, String search) {
    projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    Page<UserResponseWithProjectAndGroupPermissionsInternalDto> usersWithPermissions =
      projectDao.findMembersWithPermissionsByProjectIdAndGroupIdAndSearch(
        projectId, groupId, search, pageable);
    return toUserResponseWithPermissionsDtos(usersWithPermissions);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public Page<UserResponseWithPermissionsDto> getEditors(
    Long groupId, Long projectId,
    Pageable pageable, String search) {
    projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    Page<UserResponseWithProjectAndGroupPermissionsInternalDto> usersWithPermissions =
      projectDao.findEditorsWithPermissionsByProjectIdAndGroupIdAndSearch(
        projectId, groupId, search, pageable);
    return toUserResponseWithPermissionsDtos(usersWithPermissions);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public Page<UserResponseWithPermissionsDto> getCoordinators(
    Long groupId, Long projectId,
    Pageable pageable, String search) {
    projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    Page<UserResponseWithProjectAndGroupPermissionsInternalDto> usersWithPermissions =
      projectDao.findCoordinatorsWithPermissionsByProjectIdAndGroupIdAndSearch(
        projectId, groupId, search, pageable);
    return toUserResponseWithPermissionsDtos(usersWithPermissions);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public Page<UserResponseWithPermissionsDto> getAdmins(
    Long groupId, Long projectId,
    Pageable pageable, String search) {
    projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    Page<UserResponseWithProjectAndGroupPermissionsInternalDto> usersWithPermissions =
      projectDao.findAdminsWithPermissionsByProjectIdAndGroupIdAndSearch(
        projectId, groupId, search, pageable);
    return toUserResponseWithPermissionsDtos(usersWithPermissions);
  }

  @Transactional(rollbackFor = Exception.class)
  @Secured("ADMIN")
  public void assignMember(Long groupId, Long projectId, String username) {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    ApplicationUser applicationUser = applicationUserDao.findByUsername(username).orElseThrow(
      UserNotFoundException::new);
    project.assignMember(applicationUser);
    projectDao.save(project);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public void removeAssignedMember(Long groupId, Long projectId, Long userId) {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    ApplicationUser applicationUser = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
    UserGroup group = project.getUserGroup();
    verifyNoGroupLevelRoles(group, applicationUser);
    project.removeMember(applicationUser);
    projectDao.save(project);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public void addEditor(Long groupId, Long projectId, Long userId) {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    ApplicationUser applicationUser = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
    project.addEditor(applicationUser);
    projectDao.save(project);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public void removeEditor(Long groupId, Long projectId, Long userId) {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    ApplicationUser applicationUser = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
    UserGroup group = project.getUserGroup();
    verifyNoGroupLevelRoles(group, applicationUser);
    project.removeEditor(applicationUser);
    projectDao.save(project);
  }


  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public void addCoordinator(Long groupId, Long projectId, Long userId) {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    ApplicationUser applicationUser = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
    project.addCoordinator(applicationUser);
    projectDao.save(project);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_ADMIN')")
  public void removeCoordinator(Long groupId, Long projectId, Long userId) {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    ApplicationUser applicationUser = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
    UserGroup group = project.getUserGroup();
    verifyNoGroupLevelAdminRole(group, applicationUser);
    project.removeCoordinator(applicationUser);
    projectDao.save(project);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public void addAdmin(Long groupId, Long projectId, Long userId) {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    ApplicationUser applicationUser = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
    project.addAdmin(applicationUser);
    projectDao.save(project);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#groupId, 'UserGroup', 'GROUP_ADMIN')")
  public void removeAdmin(Long groupId, Long projectId, Long userId) {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    ApplicationUser applicationUser = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
    UserGroup group = project.getUserGroup();
    verifyNoGroupLevelAdminRole(group, applicationUser);
    project.removeAdmin(applicationUser);
    projectDao.save(project);
  }

  private Page<UserResponseWithPermissionsDto> toUserResponseWithPermissionsDtos(
    Page<UserResponseWithProjectAndGroupPermissionsInternalDto> usersWithPermissions) {
    return usersWithPermissions.map(
      user -> {
        List<PermissionType> permissions = new ArrayList<>();
        permissions.add(PermissionType.PROJECT_ASSIGNED_MEMBER);
        if (user.isAdmin()) {
          permissions.add(PermissionType.PROJECT_ADMIN);
        }
        if (user.isCoordinator()) {
          permissions.add(PermissionType.PROJECT_COORDINATOR);
        }
        if (user.isEditor()) {
          permissions.add(PermissionType.PROJECT_EDITOR);
        }
        if (user.isGroupAdmin()) {
          permissions.add(PermissionType.GROUP_ADMIN);
        }
        if (user.isGroupEditor()) {
          permissions.add(PermissionType.GROUP_EDITOR);
        }
        return new UserResponseWithPermissionsDto(
          user.userId(),
          user.username(),
          user.fullName(),
          new ArrayList<>(permissions));
      });
  }

  private void verifyNoGroupLevelRoles(UserGroup group, ApplicationUser applicationUser) {
    if (group.getEditors().contains(applicationUser) || group.getAdmins().contains(
      applicationUser)) {
      throw new AccessDeniedException(
        "User is a group level editor or admin and cannot be removed from project");
    }
  }

  private void verifyNoGroupLevelAdminRole(UserGroup group, ApplicationUser applicationUser) {
    if (group.getAdmins().contains(applicationUser)) {
      throw new AccessDeniedException(
        "User is a group level admin and cannot be removed from project");
    }
  }
}
