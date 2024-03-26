package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.group.project.ProjectCreateRequestDto;
import com.codecool.training_portal.dto.group.project.ProjectResponsePrivateDTO;
import com.codecool.training_portal.dto.group.project.ProjectResponsePublicDTO;
import com.codecool.training_portal.dto.group.project.ProjectUpdateRequestDto;
import com.codecool.training_portal.service.group.project.ProjectService;
import jakarta.validation.Valid;
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
@RequestMapping("/api/v1/groups/{groupId}/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final MessageSource messageSource;

    @GetMapping()
    public ResponseEntity<?> getProjects(
      @PathVariable @Min(1) Long groupId, @RequestParam(
            name = "withUser") Boolean withUser) {
        List<ProjectResponsePublicDTO> projects;
        if (withUser) {
            projects = projectService.getProjectsWithUser(groupId);
        } else {
            projects = projectService.getProjectsWithoutUser(groupId);
        }
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", projects));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<?> getProjectById(@PathVariable @Min(1) Long groupId, @PathVariable @Min(
            1) Long projectId) {
        ProjectResponsePrivateDTO project = projectService.getProjectById(groupId, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", project));
    }

    @PostMapping
    public ResponseEntity<?> createProject(@PathVariable @Min(
            1) Long groupId, @RequestBody @Valid ProjectCreateRequestDto projectDetails, Locale locale) {
        ProjectResponsePrivateDTO projectResponseDetails = projectService.createProject(projectDetails, groupId);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("message", messageSource.getMessage("project.create.success", null, locale), "data", projectResponseDetails));
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<?> updateProject(@PathVariable @Min(1) Long groupId, @PathVariable @Min(
            1) Long projectId, @RequestBody @Valid ProjectUpdateRequestDto projectDetails, Locale locale) {
        ProjectResponsePrivateDTO projectResponseDetails = projectService.updateProject(projectDetails, groupId, projectId);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", messageSource.getMessage("project.update.success", null, locale), "data", projectResponseDetails));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable @Min(1) Long groupId, @PathVariable @Min(
            1) Long projectId, Locale locale) {
        projectService.deleteProject(groupId, projectId);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", messageSource.getMessage("project.delete.success", null, locale)));
    }
}
