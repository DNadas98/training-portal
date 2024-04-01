package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.user.UserResponsePublicDto;
import com.codecool.training_portal.service.group.GroupRoleService;
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
@RequestMapping("/api/v1/groups/{groupId}")
public class GroupRoleController {
  private final GroupRoleService groupRoleService;
  private final MessageSource messageSource;

  @GetMapping("members")
  public ResponseEntity<?> getMembers(@PathVariable @Min(1) Long groupId) {
    List<UserResponsePublicDto> members = groupRoleService.getMembers(groupId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", members));
  }

  @PostMapping("members")
  public ResponseEntity<?> addMember(
    @PathVariable @Min(1) Long groupId, @RequestParam(name = "username") String username,
    Locale locale) {
    String decodedUsername = URLDecoder.decode(username, StandardCharsets.UTF_8);
    groupRoleService.addMember(groupId, decodedUsername);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("group.members.add.success", null, locale)));
  }

  @DeleteMapping("members/{userId}")
  public ResponseEntity<?> removeMember(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long userId, Locale locale) {
    groupRoleService.removeMember(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("group.members.remove.success", null, locale)));
  }

  @GetMapping("editors")
  public ResponseEntity<?> getEditors(@PathVariable @Min(1) Long groupId) {
    List<UserResponsePublicDto> editors = groupRoleService.getEditors(groupId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", editors));
  }

  @PostMapping("editors")
  public ResponseEntity<?> addEditor(
    @PathVariable @Min(1) Long groupId, @RequestParam(name = "userId") @Min(1) Long userId,
    Locale locale) {
    groupRoleService.addEditor(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("group.editors.add.success", null, locale)));
  }

  @DeleteMapping("editors/{userId}")
  public ResponseEntity<?> removeEditor(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long userId, Locale locale) {
    groupRoleService.removeEditor(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("group.editors.remove.success", null, locale)));
  }

  @GetMapping("admins")
  public ResponseEntity<?> getAdmins(@PathVariable @Min(1) Long groupId) {
    List<UserResponsePublicDto> admins = groupRoleService.getAdmins(groupId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", admins));
  }

  @PostMapping("admins")
  public ResponseEntity<?> addAdmin(
    @PathVariable @Min(1) Long groupId, @RequestParam(name = "userId") @Min(1) Long userId,
    Locale locale) {
    groupRoleService.addAdmin(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("group.admins.add.success", null, locale)));
  }
}