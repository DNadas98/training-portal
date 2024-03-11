package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.requests.ProjectJoinRequestResponseDto;
import com.codecool.training_portal.dto.requests.ProjectJoinRequestUpdateDto;
import com.codecool.training_portal.service.group.project.ProjectRequestService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/groups/{groupId}/projects/{projectId}/requests")
@RequiredArgsConstructor
public class ProjectRequestController {
  private final ProjectRequestService projectJoinRequestService;

  @GetMapping()
  public ResponseEntity<?> readJoinRequestsOfProject(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId) {

    List<ProjectJoinRequestResponseDto> requests =
            projectJoinRequestService.getJoinRequestsOfProject(groupId, projectId);

    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", requests));
  }

  @PostMapping()
  public ResponseEntity<?> joinProject(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId) {
    ProjectJoinRequestResponseDto createdRequest = projectJoinRequestService.createJoinRequest(
            groupId, projectId);

    return ResponseEntity.status(HttpStatus.CREATED).body(
      Map.of("message", "Request created successfully", "data", createdRequest));
  }

  @PutMapping("/{requestId}")
  public ResponseEntity<?> updateJoinRequestById(
    @PathVariable @Min(1) Long requestId,
    @RequestBody @Valid ProjectJoinRequestUpdateDto requestDto,
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId) {

      projectJoinRequestService.handleJoinRequest(groupId, projectId, requestId, requestDto);

    //TODO: notify the user who requested to join...
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Request updated successfully"));
  }
}
