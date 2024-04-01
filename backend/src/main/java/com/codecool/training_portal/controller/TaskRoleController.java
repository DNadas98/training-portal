package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.user.UserResponsePublicDto;
import com.codecool.training_portal.service.group.project.task.TaskRoleService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/groups/{groupId}/projects/{projectId}/tasks/{taskId}")
public class TaskRoleController {


  private final TaskRoleService taskRoleService;
  private final MessageSource messageSource;

  @GetMapping("members")
  public ResponseEntity<?> getMembers(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId) {
    List<UserResponsePublicDto> members = taskRoleService.getAssignedMembers(
      groupId,
      projectId,
      taskId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", members));
  }

  @PostMapping("members")
  public ResponseEntity<?> addSelf(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId, Locale locale) {
    taskRoleService.assignSelf(groupId, projectId, taskId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", messageSource.getMessage("task.members.add.success", null, locale)));
  }

  @DeleteMapping("members")
  public ResponseEntity<?> removeSelf(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId, Locale locale) {
    taskRoleService.removeSelf(groupId, projectId, taskId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", messageSource.getMessage("task.members.remove.success", null, locale)));
  }
}