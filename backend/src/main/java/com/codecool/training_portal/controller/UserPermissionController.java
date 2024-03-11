package com.codecool.training_portal.controller;

import com.codecool.training_portal.model.auth.PermissionType;
import com.codecool.training_portal.service.group.GroupRoleService;
import com.codecool.training_portal.service.group.project.ProjectRoleService;
import com.codecool.training_portal.service.group.project.task.TaskRoleService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Map;
import java.util.Set;

@Controller
@RequestMapping("/api/v1/user/permissions")
@RequiredArgsConstructor
public class UserPermissionController {
    private final GroupRoleService groupRoleService;
  private final ProjectRoleService projectRoleService;
  private final TaskRoleService taskRoleService;

    @GetMapping("/groups/{groupId}")
    public ResponseEntity<?> getOwnPermissionsForGroup(@PathVariable @Min(1) Long groupId) {
        Set<PermissionType> permissions = groupRoleService.getUserPermissionsForGroup(groupId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", permissions));
  }

    @GetMapping("/groups/{groupId}/projects/{projectId}")
  public ResponseEntity<?> getOwnPermissionsForProject(
            @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId
  ) {
    Set<PermissionType> permissions = projectRoleService.getUserPermissionsForProject(
            groupId, projectId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", permissions));
  }

    @GetMapping("/groups/{groupId}/projects/{projectId}/tasks/{taskId}")
  public ResponseEntity<?> getOwnPermissionsForTask(
            @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId
  ) {
    Set<PermissionType> permissions = taskRoleService.getUserPermissionsForTask(
            groupId, projectId, taskId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", permissions));
  }
}
