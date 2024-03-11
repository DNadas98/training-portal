package com.codecool.tasx.controller;

import com.codecool.tasx.dto.requests.ProjectJoinRequestResponseDto;
import com.codecool.tasx.dto.requests.ProjectJoinRequestUpdateDto;
import com.codecool.tasx.service.company.project.ProjectRequestService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/companies/{companyId}/projects/{projectId}/requests")
@RequiredArgsConstructor
public class ProjectRequestController {
  private final ProjectRequestService projectJoinRequestService;

  @GetMapping()
  public ResponseEntity<?> readJoinRequestsOfProject(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long projectId) {

    List<ProjectJoinRequestResponseDto> requests =
      projectJoinRequestService.getJoinRequestsOfProject(companyId, projectId);

    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", requests));
  }

  @PostMapping()
  public ResponseEntity<?> joinProject(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long projectId) {
    ProjectJoinRequestResponseDto createdRequest = projectJoinRequestService.createJoinRequest(
      companyId, projectId);

    return ResponseEntity.status(HttpStatus.CREATED).body(
      Map.of("message", "Request created successfully", "data", createdRequest));
  }

  @PutMapping("/{requestId}")
  public ResponseEntity<?> updateJoinRequestById(
    @PathVariable @Min(1) Long requestId,
    @RequestBody @Valid ProjectJoinRequestUpdateDto requestDto,
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long projectId) {

    projectJoinRequestService.handleJoinRequest(companyId, projectId, requestId, requestDto);

    //TODO: notify the user who requested to join...
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Request updated successfully"));
  }
}
