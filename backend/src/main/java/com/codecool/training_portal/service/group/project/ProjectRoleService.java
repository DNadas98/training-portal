package com.codecool.training_portal.service.group.project;

import com.codecool.training_portal.dto.user.UserResponsePublicDto;
import com.codecool.training_portal.exception.auth.UserNotFoundException;
import com.codecool.training_portal.exception.group.project.ProjectNotFoundException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.ApplicationUserDao;
import com.codecool.training_portal.model.auth.GlobalRole;
import com.codecool.training_portal.model.auth.PermissionType;
import com.codecool.training_portal.model.group.project.Project;
import com.codecool.training_portal.model.group.project.ProjectDao;
import com.codecool.training_portal.service.auth.CustomPermissionEvaluator;
import com.codecool.training_portal.service.auth.UserProvider;
import com.codecool.training_portal.service.converter.UserConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProjectRoleService {
  private final ProjectDao projectDao;
  private final ApplicationUserDao applicationUserDao;
  private final UserConverter userConverter;
  private final UserProvider userProvider;
  private final CustomPermissionEvaluator permissionEvaluator;

  @Transactional(readOnly = true)
  public Set<PermissionType> getUserPermissionsForProject(Long groupId, Long projectId) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
      Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));

    if (user.getGlobalRoles().contains(GlobalRole.ADMIN)) {
        return Set.of(PermissionType.PROJECT_ASSIGNED_MEMBER, PermissionType.PROJECT_EDITOR,
        PermissionType.PROJECT_ADMIN);
    }

    Set<PermissionType> permissions = new HashSet<>();
      permissions.add(PermissionType.PROJECT_ASSIGNED_MEMBER);
    if (permissionEvaluator.hasProjectEditorAccess(user.getId(), project)) {
      permissions.add(PermissionType.PROJECT_EDITOR);
    }
    if (permissionEvaluator.hasProjectAdminAccess(user.getId(), project)) {
      permissions.add(PermissionType.PROJECT_ADMIN);
    }
    return permissions;
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public List<UserResponsePublicDto> getAssignedMembers(Long groupId, Long projectId) {
      Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    return userConverter.getUserResponsePublicDtos(
            project.getAssignedMembers().stream().toList());
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public void assignMember(Long groupId, Long projectId, Long userId) {
      Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    ApplicationUser applicationUser = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
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
      project.removeMember(applicationUser);
    projectDao.save(project);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public List<UserResponsePublicDto> getEditors(Long groupId, Long projectId) {
      Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    return userConverter.getUserResponsePublicDtos(project.getEditors().stream().toList());
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
    project.removeEditor(applicationUser);
    projectDao.save(project);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public List<UserResponsePublicDto> getAdmins(Long groupId, Long projectId) {
      Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    return userConverter.getUserResponsePublicDtos(project.getAdmins().stream().toList());
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
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public void removeAdmin(Long groupId, Long projectId, Long userId) {
      Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    ApplicationUser applicationUser = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
    project.removeAdmin(applicationUser);
    projectDao.save(project);
  }
}
