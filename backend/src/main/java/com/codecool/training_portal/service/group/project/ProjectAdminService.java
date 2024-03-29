package com.codecool.training_portal.service.group.project;

import com.codecool.training_portal.dto.user.UserResponseWithPermissionsDto;
import com.codecool.training_portal.exception.auth.UserNotFoundException;
import com.codecool.training_portal.exception.group.project.ProjectNotFoundException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.ApplicationUserDao;
import com.codecool.training_portal.model.auth.PermissionType;
import com.codecool.training_portal.model.group.UserGroup;
import com.codecool.training_portal.model.group.project.Project;
import com.codecool.training_portal.model.group.project.ProjectDao;
import com.codecool.training_portal.service.converter.UserConverter;
import lombok.RequiredArgsConstructor;
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
  private final UserConverter userConverter;

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public List<UserResponseWithPermissionsDto> getAssignedMembers(Long groupId, Long projectId) {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    List<ApplicationUser> assignedMembers = project.getAssignedMembers();
    List<UserResponseWithPermissionsDto>
      userResponseWithPermissionsDtos = new ArrayList<>();
    List<ApplicationUser> editors = project.getEditors();
    List<ApplicationUser> admins = project.getAdmins();
    UserGroup group = project.getUserGroup();

    List<ApplicationUser> groupEditors = group.getEditors();
    List<ApplicationUser> groupAdmins = group.getAdmins();

    for (ApplicationUser applicationUser : assignedMembers) {
      List<PermissionType> permissions = new ArrayList<>();
      permissions.add(PermissionType.PROJECT_ASSIGNED_MEMBER);
      if (editors.contains(applicationUser)) {
        permissions.add(PermissionType.PROJECT_EDITOR);
      }
      if (admins.contains(applicationUser)) {
        permissions.add(PermissionType.PROJECT_ADMIN);
      }
      if (groupEditors.contains(applicationUser)) {
        permissions.add(PermissionType.GROUP_EDITOR);
      }
      if (groupAdmins.contains(applicationUser)) {
        permissions.add(PermissionType.GROUP_ADMIN);
      }
      userResponseWithPermissionsDtos.add(
        userConverter.toUserResponseWithPermissionsDto(applicationUser, permissions));
    }
    return userResponseWithPermissionsDtos;
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public List<UserResponseWithPermissionsDto> getEditors(Long groupId, Long projectId) {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    List<ApplicationUser> projectEditors = project.getEditors();
    List<UserResponseWithPermissionsDto>
      userResponseWithPermissionsDtos = new ArrayList<>();
    List<ApplicationUser> projectAdmins = project.getAdmins();

    UserGroup group = project.getUserGroup();
    List<ApplicationUser> groupEditors = group.getEditors();
    List<ApplicationUser> groupAdmins = group.getAdmins();

    for (ApplicationUser applicationUser : projectEditors) {
      List<PermissionType> permissions = new ArrayList<>();
      permissions.add(PermissionType.PROJECT_ASSIGNED_MEMBER);
      permissions.add(PermissionType.PROJECT_EDITOR);
      if (groupEditors.contains(applicationUser)) {
        permissions.add(PermissionType.GROUP_EDITOR);
      }
      if (groupAdmins.contains(applicationUser)) {
        permissions.add(PermissionType.GROUP_ADMIN);
      }
      if (projectAdmins.contains(applicationUser)) {
        permissions.add(PermissionType.PROJECT_ADMIN);
      }
      userResponseWithPermissionsDtos.add(
        userConverter.toUserResponseWithPermissionsDto(applicationUser, permissions));
    }
    return userResponseWithPermissionsDtos;
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public List<UserResponseWithPermissionsDto> getAdmins(Long groupId, Long projectId) {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    List<ApplicationUser> admins = project.getAdmins();
    List<ApplicationUser> editors = project.getEditors();
    List<UserResponseWithPermissionsDto>
      userResponseWithPermissionsDtos = new ArrayList<>();

    UserGroup group = project.getUserGroup();
    List<ApplicationUser> groupEditors = group.getEditors();
    List<ApplicationUser> groupAdmins = group.getAdmins();

    for (ApplicationUser applicationUser : admins) {
      List<PermissionType> permissions = new ArrayList<>();
      permissions.add(PermissionType.PROJECT_ASSIGNED_MEMBER);
      permissions.add(PermissionType.PROJECT_ADMIN);
      if (editors.contains(applicationUser)) {
        permissions.add(PermissionType.PROJECT_EDITOR);
      }
      if (groupEditors.contains(applicationUser)) {
        permissions.add(PermissionType.GROUP_EDITOR);
      }
      if (groupAdmins.contains(applicationUser)) {
        permissions.add(PermissionType.GROUP_ADMIN);
      }
      userResponseWithPermissionsDtos.add(
        userConverter.toUserResponseWithPermissionsDto(applicationUser, permissions));
    }
    return userResponseWithPermissionsDtos;
  }

  @Transactional(rollbackFor = Exception.class)
  @Secured("ADMIN")
  public void assignMember(Long groupId, Long projectId, String username) {
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    ApplicationUser applicationUser = applicationUserDao.findByUsername(username).orElseThrow(
      () -> new UserNotFoundException());
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
