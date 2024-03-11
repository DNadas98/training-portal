package com.codecool.tasx.controller;

import com.codecool.tasx.dto.company.project.task.TaskCreateRequestDto;
import com.codecool.tasx.dto.company.project.task.TaskResponsePublicDto;
import com.codecool.tasx.dto.company.project.task.TaskUpdateRequestDto;
import com.codecool.tasx.model.company.project.task.TaskStatus;
import com.codecool.tasx.service.company.project.task.TaskService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/companies/{companyId}/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {
  private final TaskService taskService;

  @GetMapping
  public ResponseEntity<?> getAllTasks(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long projectId,
    @RequestParam(name = "withUser", required = false) Boolean withUser,
    @RequestParam(name = "taskStatus", required = false) TaskStatus taskStatus) {
    List<TaskResponsePublicDto> tasks;
    if (withUser == null) {
      tasks = taskService.getAllTasks(companyId, projectId);
    } else if (taskStatus == null) {
      tasks = taskService.getAllTasks(companyId, projectId, withUser);
    } else {
      tasks = taskService.getAllTasks(companyId, projectId, withUser, taskStatus);
    }
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", tasks));
  }

  @GetMapping("/{taskId}")
  public ResponseEntity<?> getTaskById(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId) {
    TaskResponsePublicDto task = taskService.getTaskById(companyId, projectId, taskId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", task));
  }

  @PostMapping
  public ResponseEntity<?> createTask(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long projectId,
    @RequestBody @Valid TaskCreateRequestDto taskDetails) {
    TaskResponsePublicDto taskResponseDetails = taskService.createTask(taskDetails, companyId,
      projectId);
    return ResponseEntity.status(HttpStatus.CREATED).body(
      Map.of("message", "Task created successfully", "data", taskResponseDetails));
  }

  @PutMapping("/{taskId}")
  public ResponseEntity<?> updateTask(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId, @RequestBody @Valid TaskUpdateRequestDto taskDetails) {
    TaskResponsePublicDto taskResponseDetails = taskService.updateTask(taskDetails, companyId,
      projectId, taskId);

    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Task with ID " + taskId + " updated successfully", "data",
        taskResponseDetails));
  }

  @DeleteMapping("/{taskId}")
  public ResponseEntity<?> deleteTask(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId) {
    taskService.deleteTask(companyId, projectId, taskId);

    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Task with ID " + taskId + " deleted successfully"));
  }
}
