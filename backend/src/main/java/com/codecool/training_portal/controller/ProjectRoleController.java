package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.user.UserResponsePublicDto;
import com.codecool.training_portal.service.group.project.ProjectRoleService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/groups/{groupId}/projects/{projectId}")
public class ProjectRoleController {

  private final ProjectRoleService projectRoleService;

    @GetMapping("members")
    public ResponseEntity<?> getMembers(
            @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId) {
        List<UserResponsePublicDto> members = projectRoleService.getAssignedMembers(
                groupId,
      projectId);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", members));
  }

    @PostMapping("members")
    public ResponseEntity<?> addMember(
            @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestParam(name = "userId") @Min(1) Long userId) {
        projectRoleService.assignMember(groupId, projectId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
            Map.of("message", "Member added successfully"));
  }

    @DeleteMapping("members/{userId}")
    public ResponseEntity<?> removeMember(
            @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long userId) {
        projectRoleService.removeAssignedMember(groupId, projectId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
            Map.of("message", "Member removed successfully"));
  }

  @GetMapping("editors")
  public ResponseEntity<?> getEditors(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId) {
      List<UserResponsePublicDto> editors = projectRoleService.getEditors(groupId, projectId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", editors));
  }

  @PostMapping("editors")
  public ResponseEntity<?> addEditor(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestParam(name = "userId") @Min(1) Long userId) {
      projectRoleService.addEditor(groupId, projectId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Editor added successfully"));
  }

  @DeleteMapping("editors/{userId}")
  public ResponseEntity<?> removeEditor(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long userId) {
      projectRoleService.removeEditor(groupId, projectId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Editor removed successfully"));
  }

  @GetMapping("admins")
  public ResponseEntity<?> getAdmins(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId) {
      List<UserResponsePublicDto> admins = projectRoleService.getAdmins(groupId, projectId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", admins));
  }

  @PostMapping("admins")
  public ResponseEntity<?> addAdmin(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @RequestParam(name = "userId") @Min(1) Long userId) {
      projectRoleService.addAdmin(groupId, projectId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Admin added successfully"));
  }

  @DeleteMapping("admins/{userId}")
  public ResponseEntity<?> removeAdmin(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId,
    @PathVariable @Min(1) Long userId) {
      projectRoleService.removeAdmin(groupId, projectId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Admin removed successfully"));
  }
}