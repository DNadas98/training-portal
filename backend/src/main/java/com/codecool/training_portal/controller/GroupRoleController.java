package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.user.UserResponsePublicDto;
import com.codecool.training_portal.service.group.GroupRoleService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/groups/{groupId}")
public class GroupRoleController {
    private final GroupRoleService groupRoleService;

    @GetMapping("members")
    public ResponseEntity<?> getMembers(@PathVariable @Min(1) Long groupId) {
        List<UserResponsePublicDto> members = groupRoleService.getMembers(groupId);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", members));
  }

    @PostMapping("members")
    public ResponseEntity<?> addMember(
            @PathVariable @Min(1) Long groupId, @RequestParam(name = "userId") @Min(
            1) Long userId) {
        groupRoleService.addMember(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
            Map.of("message", "Member added successfully"));
  }

    @DeleteMapping("members/{userId}")
    public ResponseEntity<?> removeMember(
            @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long userId) {
        groupRoleService.removeMember(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
            Map.of("message", "Member removed successfully"));
  }

  @GetMapping("editors")
  public ResponseEntity<?> getEditors(@PathVariable @Min(1) Long groupId) {
      List<UserResponsePublicDto> editors = groupRoleService.getEditors(groupId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", editors));
  }

  @PostMapping("editors")
  public ResponseEntity<?> addEditor(
          @PathVariable @Min(1) Long groupId, @RequestParam(name = "userId") @Min(1) Long userId) {
      groupRoleService.addEditor(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Editor added successfully"));
  }

  @DeleteMapping("editors/{userId}")
  public ResponseEntity<?> removeEditor(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long userId) {
      groupRoleService.removeEditor(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Editor removed successfully"));
  }

  @GetMapping("admins")
  public ResponseEntity<?> getAdmins(@PathVariable @Min(1) Long groupId) {
      List<UserResponsePublicDto> admins = groupRoleService.getAdmins(groupId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", admins));
  }

  @PostMapping("admins")
  public ResponseEntity<?> addAdmin(
          @PathVariable @Min(1) Long groupId, @RequestParam(name = "userId") @Min(1) Long userId) {
      groupRoleService.addAdmin(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Admin added successfully"));
  }

  @DeleteMapping("admins/{userId}")
  public ResponseEntity<?> removeAdmin(
          @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long userId) {
      groupRoleService.removeAdmin(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Admin removed successfully"));
  }
}