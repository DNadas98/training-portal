package com.codecool.training_portal.service.auth;

import com.codecool.training_portal.config.auth.SecurityConfig;
import com.codecool.training_portal.exception.auth.UserNotFoundException;
import com.codecool.training_portal.exception.group.GroupNotFoundException;
import com.codecool.training_portal.exception.group.project.ProjectNotFoundException;
import com.codecool.training_portal.exception.group.project.task.TaskNotFoundException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.ApplicationUserDao;
import com.codecool.training_portal.model.auth.GlobalRole;
import com.codecool.training_portal.model.auth.PermissionType;
import com.codecool.training_portal.model.group.UserGroup;
import com.codecool.training_portal.model.group.UserGroupDao;
import com.codecool.training_portal.model.group.project.Project;
import com.codecool.training_portal.model.group.project.ProjectDao;
import com.codecool.training_portal.model.group.project.task.Task;
import com.codecool.training_portal.model.group.project.task.TaskDao;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.PermissionEvaluator;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;

/**
 * @see SecurityConfig
 * @see org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
 * @see org.springframework.security.access.expression.method.MethodSecurityExpressionHandler
 */
@Component
@RequiredArgsConstructor
public class CustomPermissionEvaluator implements PermissionEvaluator {
  private final ApplicationUserDao applicationUserDao;
    private final UserGroupDao userGroupDao;
  private final ProjectDao projectDao;
  private final TaskDao taskDao;

  /**
   * @param authentication     <strong>Passed in automatically</strong> from the {@link org.springframework.security.core.context.SecurityContextHolder}<br>
   *                           Represents the user in question. Should not be null.
   * @param targetDomainObject The domain object for which permissions should be
   *                           checked. May be null in which case implementations should return false, as the null
   *                           condition can be checked explicitly in the expression.
   * @param permission         A representation of the permission object as supplied by the
   *                           expression system. Not null.
   * @return true if the permission is granted, false otherwise
   */
  @Override
  @Transactional(readOnly = true)
  public boolean hasPermission(
    Authentication authentication, Object targetDomainObject, Object permission) {
    if ((authentication == null) || (targetDomainObject == null) ||
      !(permission instanceof PermissionType)) {
      return false;
    }
    Long userId = (Long) authentication.getPrincipal();

      if (targetDomainObject instanceof UserGroup) {
          return handleGroupPermissions(
                  userId, (UserGroup) targetDomainObject, (PermissionType) permission);
    } else if (targetDomainObject instanceof Project) {
      return handleProjectPermissions(
        userId, (Project) targetDomainObject, (PermissionType) permission);
    } else if (targetDomainObject instanceof Task) {
      return handleTaskPermissions(
        userId, (Task) targetDomainObject, (PermissionType) permission);
    }
    return false;
  }

  /**
   * Alternative method for evaluating a permission where only the identifier of the
   * target object is available, rather than the target instance itself.
   *
   * @param authentication <strong>Passed in automatically</strong> from the {@link org.springframework.security.core.context.SecurityContextHolder}<br>
   *                       Represents the user in question. Should not be null.
   * @param targetId       The identifier for the object instance (usually a Long)
   * @param targetType     A String representing the target's type (usually a Java
   *                       classname). Not null.
   * @param permission     A representation of the permission object as supplied by the
   *                       expression system. Not null.
   * @return true if the permission is granted, false otherwise
   * @Warning Not type safe
   */
  @Override
  @Transactional(readOnly = true)
  public boolean hasPermission(
    Authentication authentication, Serializable targetId, String targetType, Object permission) {
    if ((authentication == null) || (targetId == null) || (targetType.isEmpty()) ||
      (permission == null)) {
      return false;
    }
    Long userId = (Long) authentication.getPrincipal();

    Long id = (Long) targetId;
    PermissionType permissionType = PermissionType.valueOf(permission.toString());

    switch (targetType) {
        case "UserGroup" -> {
            UserGroup userGroup = userGroupDao.findById(id).orElseThrow(
                    () -> new GroupNotFoundException(id));
            return handleGroupPermissions(userId, userGroup, permissionType);
      }
      case "Project" -> {
        Project project = projectDao.findById(id).orElseThrow(
          () -> new ProjectNotFoundException(id));
        return handleProjectPermissions(userId, project, permissionType);
      }
      case "Task" -> {
        Task task = taskDao.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        return handleTaskPermissions(userId, task, permissionType);
      }
      default -> {
        return false;
      }
    }
  }

  @Transactional(readOnly = true)
  public boolean handleGroupPermissions(
          Long userId, UserGroup userGroup, PermissionType permissionType) {
    switch (permissionType) {
        case GROUP_ADMIN:
            return hasGroupAdminAccess(userId, userGroup);
        case GROUP_EDITOR:
            return hasGroupEditorAccess(userId, userGroup);
        case GROUP_MEMBER:
            return hasGroupMemberAccess(userId, userGroup);
      default:
        return false;
    }
  }

  @Transactional(readOnly = true)
  public boolean handleProjectPermissions(
    Long userId, Project project, PermissionType permissionType) {
    switch (permissionType) {
      case PROJECT_ADMIN:
        return hasProjectAdminAccess(userId, project);
      case PROJECT_EDITOR:
        return hasProjectEditorAccess(userId, project);
        case PROJECT_ASSIGNED_MEMBER:
            return hasProjectAssignedMemberAccess(userId, project);
      default:
        return false;
    }
  }

  @Transactional(readOnly = true)
  public boolean handleTaskPermissions(
    Long userId, Task task, PermissionType permissionType) {
    switch (permissionType) {
        case TASK_ASSIGNED_MEMBER:
            return hasTaskAssignedMemberAccess(userId, task);
      default:
        return false;
    }
  }

  @Transactional(readOnly = true)
  public boolean hasGroupAdminAccess(Long userId, UserGroup userGroup) {
      ApplicationUser applicationUser = applicationUserDao.findByIdAndFetchAdminGroups(userId)
      .orElseThrow(() -> new UserNotFoundException());
    return applicationUser.getGlobalRoles().contains(GlobalRole.ADMIN) ||
            applicationUser.getAdminUserGroups().contains(userGroup);
  }

  @Transactional(readOnly = true)
  public boolean hasGroupEditorAccess(Long userId, UserGroup userGroup) {
      ApplicationUser applicationUser = applicationUserDao.findByIdAndFetchEditorGroups(userId)
      .orElseThrow(() -> new UserNotFoundException());
    return applicationUser.getGlobalRoles().contains(GlobalRole.ADMIN) ||
            applicationUser.getEditorUserGroups().contains(userGroup);
  }

  @Transactional(readOnly = true)
  public boolean hasGroupMemberAccess(Long userId, UserGroup userGroup) {
      ApplicationUser applicationUser = applicationUserDao.findByIdAndFetchMemberGroups(userId)
      .orElseThrow(() -> new UserNotFoundException());
    return applicationUser.getGlobalRoles().contains(GlobalRole.ADMIN) ||
            applicationUser.getMemberUserGroups().contains(userGroup);
  }

  @Transactional(readOnly = true)
  public boolean hasProjectAdminAccess(Long userId, Project project) {
    ApplicationUser applicationUser = applicationUserDao.findByIdAndFetchAdminProjects(userId)
      .orElseThrow(() -> new UserNotFoundException());
    return applicationUser.getGlobalRoles().contains(GlobalRole.ADMIN) ||
            applicationUser.getAdminProjects().contains(project) || hasGroupAdminAccess(
      userId,
            project.getUserGroup());
  }

  @Transactional(readOnly = true)
  public boolean hasProjectEditorAccess(Long userId, Project project) {
    ApplicationUser applicationUser = applicationUserDao.findByIdAndFetchEditorProjects(userId)
      .orElseThrow(() -> new UserNotFoundException());
    return applicationUser.getGlobalRoles().contains(GlobalRole.ADMIN) ||
            applicationUser.getEditorProjects().contains(project) || hasGroupEditorAccess(
      userId,
            project.getUserGroup());
  }

  @Transactional(readOnly = true)
  public boolean hasProjectAssignedMemberAccess(
    Long userId, Project project) {
    ApplicationUser applicationUser = applicationUserDao.findByIdAndFetchAssignedProjects(userId)
      .orElseThrow(() -> new UserNotFoundException());
    return applicationUser.getGlobalRoles().contains(GlobalRole.ADMIN) ||
            applicationUser.getAssignedProjects().contains(project) || hasGroupEditorAccess(
      userId,
            project.getUserGroup());
  }

  @Transactional(readOnly = true)
  public boolean hasTaskAssignedMemberAccess(
    Long userId, Task task) {
    ApplicationUser applicationUser = applicationUserDao.findByIdAndFetchAssignedTasks(userId)
      .orElseThrow(() -> new UserNotFoundException());
    return applicationUser.getGlobalRoles().contains(GlobalRole.ADMIN) ||
      applicationUser.getAssignedTasks().contains(task) || hasProjectEditorAccess(
      userId,
      task.getProject());
  }
}
