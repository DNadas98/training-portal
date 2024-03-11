package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.group.project.ProjectCreateRequestDto;
import com.codecool.training_portal.dto.group.project.ProjectResponsePrivateDTO;
import com.codecool.training_portal.dto.group.project.ProjectResponsePublicDTO;
import com.codecool.training_portal.dto.group.project.ProjectUpdateRequestDto;
import com.codecool.training_portal.service.group.project.ProjectService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/groups/{groupId}/projects")
@RequiredArgsConstructor
public class ProjectController {
  private final ProjectService projectService;

  @GetMapping()
  public ResponseEntity<?> getProjectsWithUser(
          @PathVariable @Min(1) Long groupId, @RequestParam(name = "withUser") Boolean withUser) {
    List<ProjectResponsePublicDTO> projects;
    if (withUser) {
        projects = projectService.getProjectsWithUser(groupId);
    } else {
        projects = projectService.getProjectsWithoutUser(groupId);
    }
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", projects));
  }

  @GetMapping("/{projectId}")
  public ResponseEntity<?> getProjectById(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId) {
      ProjectResponsePrivateDTO project = projectService.getProjectById(groupId, projectId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", project));
  }

  @PostMapping
  public ResponseEntity<?> createProject(
          @PathVariable @Min(1) Long groupId,
    @RequestBody @Valid ProjectCreateRequestDto projectDetails) {
    ProjectResponsePrivateDTO projectResponseDetails = projectService.createProject(
            projectDetails, groupId);
    return ResponseEntity.status(HttpStatus.CREATED).body(
      Map.of("message", "Project created successfully", "data", projectResponseDetails));
  }

  @PutMapping("/{projectId}")
  public ResponseEntity<?> updateProject(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestBody @Valid ProjectUpdateRequestDto projectDetails) {
    ProjectResponsePrivateDTO projectResponseDetails = projectService.updateProject(
            projectDetails, groupId, projectId);

    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Project with ID " + projectId + " updated successfully", "data",
        projectResponseDetails));
  }

  @DeleteMapping("/{projectId}")
  public ResponseEntity<?> deleteProject(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId) {
      projectService.deleteProject(groupId, projectId);

    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Project with ID " + projectId + " deleted successfully"));
  }
}
