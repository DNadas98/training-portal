package net.dnadas.training_portal.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.requests.ProjectJoinRequestResponseDto;
import net.dnadas.training_portal.dto.requests.ProjectJoinRequestUpdateDto;
import net.dnadas.training_portal.service.group.project.ProjectRequestService;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/groups/{groupId}/projects/{projectId}/requests")
@RequiredArgsConstructor
public class ProjectRequestController {
  private final ProjectRequestService projectJoinRequestService;
  private final MessageSource messageSource;

  @GetMapping()
  public ResponseEntity<?> readJoinRequestsOfProject(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestParam @Min(1) int page,
    @RequestParam @Min(1) @Max(50) int size, @RequestParam(required = false) String search) {
    String decodedSearch = URLDecoder.decode(search, StandardCharsets.UTF_8);
    //TODO: sanitize search input
    Page<ProjectJoinRequestResponseDto> requests =
      projectJoinRequestService.getJoinRequestsOfProject(groupId, projectId, decodedSearch,
        PageRequest.of(page - 1, size));
    Map<String, Object> response = new HashMap<>();
    response.put("data", requests.getContent());
    response.put("totalPages", requests.getTotalPages());
    response.put("currentPage", requests.getNumber() + 1);
    response.put("totalItems", requests.getTotalElements());
    response.put("size", requests.getSize());
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @PostMapping()
  public ResponseEntity<?> joinProject(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId, Locale locale) {
    ProjectJoinRequestResponseDto createdRequest = projectJoinRequestService.createJoinRequest(
      groupId, projectId);

    return ResponseEntity.status(HttpStatus.CREATED).body(
      Map.of("message",
        messageSource.getMessage("project.requests.create.success", null, locale),
        "data", createdRequest));
  }

  @PutMapping("/{requestId}")
  public ResponseEntity<?> updateJoinRequestById(
    @PathVariable @Min(1) Long requestId,
    @RequestBody @Valid ProjectJoinRequestUpdateDto requestDto,
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId, Locale locale) {
    projectJoinRequestService.handleJoinRequest(groupId, projectId, requestId, requestDto);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("project.requests.update.success", null, locale)));
  }
}
