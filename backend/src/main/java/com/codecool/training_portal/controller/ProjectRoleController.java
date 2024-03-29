package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.user.UserResponseWithPermissionsDto;
import com.codecool.training_portal.service.group.project.ProjectAdminService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
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
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId) {
    List<UserResponseWithPermissionsDto> members = projectAdminService.getAssignedMembers(
      groupId, projectId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", members));
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
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId) {
    List<UserResponseWithPermissionsDto> editors = projectAdminService.getEditors(
      groupId, projectId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", editors));
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

  @GetMapping("admins")
  public ResponseEntity<?> getAdmins(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId) {
    List<UserResponseWithPermissionsDto> admins = projectAdminService.getAdmins(groupId, projectId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", admins));
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