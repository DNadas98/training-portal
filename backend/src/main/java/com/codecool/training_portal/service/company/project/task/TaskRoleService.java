package com.codecool.training_portal.service.company.project.task;

import com.codecool.training_portal.dto.user.UserResponsePublicDto;
import com.codecool.training_portal.exception.company.project.task.TaskNotFoundException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.GlobalRole;
import com.codecool.training_portal.model.auth.PermissionType;
import com.codecool.training_portal.model.company.project.task.Task;
import com.codecool.training_portal.model.company.project.task.TaskDao;
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
public class TaskRoleService {
  private final TaskDao taskDao;
  private final UserProvider userProvider;
  private final UserConverter userConverter;
  private final CustomPermissionEvaluator permissionEvaluator;

  @Transactional(readOnly = true)
  public Set<PermissionType> getUserPermissionsForTask(
    Long companyId, Long projectId, Long taskId) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    Task task = taskDao.findByCompanyIdAndProjectIdAndTaskId(companyId, projectId, taskId)
      .orElseThrow(() -> new TaskNotFoundException(taskId));

    if (user.getGlobalRoles().contains(GlobalRole.ADMIN)) {
      return Set.of(PermissionType.TASK_ASSIGNED_EMPLOYEE);
    }

    Set<PermissionType> permissions = new HashSet<>();
    if (permissionEvaluator.hasTaskAssignedEmployeeAccess(user.getId(), task)) {
      permissions.add(PermissionType.TASK_ASSIGNED_EMPLOYEE);
    }
    return permissions;
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#taskId, 'Project', 'PROJECT_ASSIGNED_EMPLOYEE')")
  public List<UserResponsePublicDto> getAssignedEmployees(
    Long companyId, Long projectId, Long taskId) {
    Task task = taskDao.findByCompanyIdAndProjectIdAndTaskId(companyId, projectId, taskId)
      .orElseThrow(() -> new TaskNotFoundException(taskId));
    return userConverter.getUserResponsePublicDtos(task.getAssignedEmployees().stream().toList());
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#taskId, 'Project', 'PROJECT_ASSIGNED_EMPLOYEE')")
  public void assignSelf(Long companyId, Long projectId, Long taskId) {
    Task task = taskDao.findByCompanyIdAndProjectIdAndTaskId(companyId, projectId, taskId)
      .orElseThrow(() -> new TaskNotFoundException(taskId));
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    task.assignEmployee(applicationUser);
    taskDao.save(task);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#taskId, 'Project', 'PROJECT_ASSIGNED_EMPLOYEE')")
  public void removeSelf(Long companyId, Long projectId, Long taskId) {
    Task task = taskDao.findByCompanyIdAndProjectIdAndTaskId(companyId, projectId, taskId)
      .orElseThrow(() -> new TaskNotFoundException(taskId));
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    task.removeEmployee(applicationUser);
    taskDao.save(task);
  }
}
