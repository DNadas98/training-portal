package net.dnadas.training_portal.controller;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.user.UserResponseWithPermissionsDto;
import net.dnadas.training_portal.service.group.project.ProjectAdminService;
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
@RequiredArgsConstructor
@RequestMapping("/api/v1/groups/{groupId}/projects/{projectId}")
public class ProjectRoleController {

  private final ProjectAdminService projectAdminService;
  private final MessageSource messageSource;

  @GetMapping("members")
  public ResponseEntity<?> getMembers(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestParam @Min(1) int page,
    @RequestParam @Min(1) @Max(50) int size, @RequestParam(required = false) String search) {
    Page<UserResponseWithPermissionsDto> members = projectAdminService.getAssignedMembers(
      groupId, projectId, PageRequest.of(page - 1, size), search);
    Map<String, Object> response = new HashMap<>();
    response.put("data", members.getContent());
    response.put("totalPages", members.getTotalPages());
    response.put("currentPage", members.getNumber() + 1);
    response.put("totalItems", members.getTotalElements());
    response.put("size", members.getSize());
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @PostMapping("members")
  public ResponseEntity<?> addMember(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestParam(name = "username") @Min(1) String username, Locale locale) {
    String decodedUsername = URLDecoder.decode(username, StandardCharsets.UTF_8);
    projectAdminService.assignMember(groupId, projectId, decodedUsername);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("project.members.add.success", null, locale)));
  }

  @DeleteMapping("members/{userId}")
  public ResponseEntity<?> removeMember(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long userId, Locale locale) {
    projectAdminService.removeAssignedMember(groupId, projectId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("project.members.remove.success", null, locale)));
  }

  @GetMapping("editors")
  public ResponseEntity<?> getEditors(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestParam @Min(1) int page,
    @RequestParam @Min(1) @Max(50) int size, @RequestParam(required = false) String search) {
    Page<UserResponseWithPermissionsDto> editors = projectAdminService.getEditors(
      groupId, projectId, PageRequest.of(page - 1, size), search);
    Map<String, Object> response = new HashMap<>();
    response.put("data", editors.getContent());
    response.put("totalPages", editors.getTotalPages());
    response.put("currentPage", editors.getNumber() + 1);
    response.put("totalItems", editors.getTotalElements());
    response.put("size", editors.getSize());
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @PostMapping("editors")
  public ResponseEntity<?> addEditor(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestParam(name = "userId") @Min(1) Long userId, Locale locale) {
    projectAdminService.addEditor(groupId, projectId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("project.editors.add.success", null, locale)));
  }

  @DeleteMapping("editors/{userId}")
  public ResponseEntity<?> removeEditor(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long userId, Locale locale) {
    projectAdminService.removeEditor(groupId, projectId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("project.editors.remove.success", null, locale)));
  }

  @GetMapping("coordinators")
  public ResponseEntity<?> getCoordinators(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestParam @Min(1) int page,
    @RequestParam @Min(1) @Max(50) int size, @RequestParam(required = false) String search) {
    Page<UserResponseWithPermissionsDto> coordinators = projectAdminService.getCoordinators(
      groupId, projectId, PageRequest.of(page - 1, size), search);
    Map<String, Object> response = new HashMap<>();
    response.put("data", coordinators.getContent());
    response.put("totalPages", coordinators.getTotalPages());
    response.put("currentPage", coordinators.getNumber() + 1);
    response.put("totalItems", coordinators.getTotalElements());
    response.put("size", coordinators.getSize());
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @PostMapping("coordinators")
  public ResponseEntity<?> addCoordinator(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestParam(name = "userId") @Min(1) Long userId, Locale locale) {
    projectAdminService.addCoordinator(groupId, projectId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("project.coordinators.add.success", null, locale)));
  }

  @DeleteMapping("coordinators/{userId}")
  public ResponseEntity<?> deleteCoordinator(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long userId, Locale locale) {
    projectAdminService.removeCoordinator(groupId, projectId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("project.coordinators.remove.success", null, locale)));
  }


  @GetMapping("admins")
  public ResponseEntity<?> getAdmins(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestParam @Min(1) int page,
    @RequestParam @Min(1) @Max(50) int size, @RequestParam(required = false) String search) {
    Page<UserResponseWithPermissionsDto> admins = projectAdminService.getAdmins(
      groupId, projectId, PageRequest.of(page - 1, size), search);
    Map<String, Object> response = new HashMap<>();
    response.put("data", admins.getContent());
    response.put("totalPages", admins.getTotalPages());
    response.put("currentPage", admins.getNumber() + 1);
    response.put("totalItems", admins.getTotalElements());
    response.put("size", admins.getSize());
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @PostMapping("admins")
  public ResponseEntity<?> addAdmin(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestParam(name = "userId") @Min(1) Long userId, Locale locale) {
    projectAdminService.addAdmin(groupId, projectId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("project.admins.add.success", null, locale)));
  }

  @DeleteMapping("admins/{userId}")
  public ResponseEntity<?> removeAdmin(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long userId, Locale locale) {
    projectAdminService.removeAdmin(groupId, projectId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("project.admins.remove.success", null, locale)));
  }
}