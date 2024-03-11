package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.group.project.task.TaskCreateRequestDto;
import com.codecool.training_portal.dto.group.project.task.TaskResponsePublicDto;
import com.codecool.training_portal.dto.group.project.task.TaskUpdateRequestDto;
import com.codecool.training_portal.model.group.project.task.TaskStatus;
import com.codecool.training_portal.service.group.project.task.TaskService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/groups/{groupId}/projects/{projectId}/tasks")
@RequiredArgsConstructor
public class TaskController {
  private final TaskService taskService;

  @GetMapping
  public ResponseEntity<?> getAllTasks(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestParam(name = "withUser", required = false) Boolean withUser,
    @RequestParam(name = "taskStatus", required = false) TaskStatus taskStatus) {
    List<TaskResponsePublicDto> tasks;
    if (withUser == null) {
        tasks = taskService.getAllTasks(groupId, projectId);
    } else if (taskStatus == null) {
        tasks = taskService.getAllTasks(groupId, projectId, withUser);
    } else {
        tasks = taskService.getAllTasks(groupId, projectId, withUser, taskStatus);
    }
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", tasks));
  }

  @GetMapping("/{taskId}")
  public ResponseEntity<?> getTaskById(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId) {
      TaskResponsePublicDto task = taskService.getTaskById(groupId, projectId, taskId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", task));
  }

  @PostMapping
  public ResponseEntity<?> createTask(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestBody @Valid TaskCreateRequestDto taskDetails) {
      TaskResponsePublicDto taskResponseDetails = taskService.createTask(taskDetails, groupId,
      projectId);
    return ResponseEntity.status(HttpStatus.CREATED).body(
      Map.of("message", "Task created successfully", "data", taskResponseDetails));
  }

  @PutMapping("/{taskId}")
  public ResponseEntity<?> updateTask(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId, @RequestBody @Valid TaskUpdateRequestDto taskDetails) {
      TaskResponsePublicDto taskResponseDetails = taskService.updateTask(taskDetails, groupId,
      projectId, taskId);

    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Task with ID " + taskId + " updated successfully", "data",
        taskResponseDetails));
  }

  @DeleteMapping("/{taskId}")
  public ResponseEntity<?> deleteTask(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long taskId) {
      taskService.deleteTask(groupId, projectId, taskId);

    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Task with ID " + taskId + " deleted successfully"));
  }
}
