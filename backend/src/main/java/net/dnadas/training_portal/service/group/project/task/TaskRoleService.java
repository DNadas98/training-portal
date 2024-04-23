package net.dnadas.training_portal.service.group.project.task;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.user.UserResponsePublicDto;
import net.dnadas.training_portal.exception.group.project.task.TaskNotFoundException;
import net.dnadas.training_portal.model.auth.GlobalRole;
import net.dnadas.training_portal.model.auth.PermissionType;
import net.dnadas.training_portal.model.group.project.task.Task;
import net.dnadas.training_portal.model.group.project.task.TaskDao;
import net.dnadas.training_portal.model.user.ApplicationUser;
import net.dnadas.training_portal.service.auth.CustomPermissionEvaluator;
import net.dnadas.training_portal.service.user.UserProvider;
import net.dnadas.training_portal.service.utils.converter.UserConverter;
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
    Long groupId, Long projectId, Long taskId) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    Task task = taskDao.findByGroupIdAndProjectIdAndTaskId(groupId, projectId, taskId)
      .orElseThrow(() -> new TaskNotFoundException(taskId));

    if (user.getGlobalRoles().contains(GlobalRole.ADMIN)) {
      return Set.of(PermissionType.TASK_ASSIGNED_MEMBER);
    }

    Set<PermissionType> permissions = new HashSet<>();
    if (permissionEvaluator.hasTaskAssignedMemberAccess(user.getId(), task)) {
      permissions.add(PermissionType.TASK_ASSIGNED_MEMBER);
    }
    return permissions;
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_MEMBER')")
  public List<UserResponsePublicDto> getAssignedMembers(
    Long groupId, Long projectId, Long taskId) {
    Task task = taskDao.findByGroupIdAndProjectIdAndTaskId(groupId, projectId, taskId)
      .orElseThrow(() -> new TaskNotFoundException(taskId));
    return userConverter.toUserResponsePublicDtos(task.getAssignedMembers().stream().toList());
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public void assignSelf(Long groupId, Long projectId, Long taskId) {
    Task task = taskDao.findByGroupIdAndProjectIdAndTaskId(groupId, projectId, taskId)
      .orElseThrow(() -> new TaskNotFoundException(taskId));
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    task.assignMember(applicationUser);
    taskDao.save(task);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#taskId, 'Task', 'TASK_ASSIGNED_MEMBER')")
  public void removeSelf(Long groupId, Long projectId, Long taskId) {
    Task task = taskDao.findByGroupIdAndProjectIdAndTaskId(groupId, projectId, taskId)
      .orElseThrow(() -> new TaskNotFoundException(taskId));
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    task.removeMember(applicationUser);
    taskDao.save(task);
  }
}
