package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.user.UserResponsePublicDto;
import com.codecool.training_portal.service.company.project.task.TaskRoleService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/companies/{companyId}/projects/{projectId}/tasks/{taskId}")
public class TaskRoleController {


  private final TaskRoleService taskRoleService;

  @GetMapping("employees")
  public ResponseEntity<?> getEmployees(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId) {
    List<UserResponsePublicDto> employees = taskRoleService.getAssignedEmployees(
      companyId,
      projectId,
      taskId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", employees));
  }

  @PostMapping("employees")
  public ResponseEntity<?> addSelf(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId) {
    taskRoleService.assignSelf(companyId, projectId, taskId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Employee added successfully"));
  }

  @DeleteMapping("employees")
  public ResponseEntity<?> removeSelf(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId) {
    taskRoleService.removeSelf(companyId, projectId, taskId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Employee removed successfully"));
  }
}