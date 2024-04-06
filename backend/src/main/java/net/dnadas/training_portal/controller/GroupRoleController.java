package net.dnadas.training_portal.controller;

import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.user.UserResponsePublicDto;
import net.dnadas.training_portal.service.group.GroupAdminService;
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
  private final GroupAdminService groupAdminService;
  private final MessageSource messageSource;

  @GetMapping("members")
  public ResponseEntity<?> getMembers(@PathVariable @Min(1) Long groupId) {
    List<UserResponsePublicDto> members = groupAdminService.getMembers(groupId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", members));
  }

  @PostMapping("members")
  public ResponseEntity<?> addMember(
    @PathVariable @Min(1) Long groupId, @RequestParam(name = "username") String username,
    Locale locale) {
    String decodedUsername = URLDecoder.decode(username, StandardCharsets.UTF_8);
    groupAdminService.addMember(groupId, decodedUsername);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("group.members.add.success", null, locale)));
  }

  @DeleteMapping("members/{userId}")
  public ResponseEntity<?> removeMember(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long userId, Locale locale) {
    groupAdminService.removeMember(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("group.members.remove.success", null, locale)));
  }

  @GetMapping("editors")
  public ResponseEntity<?> getEditors(@PathVariable @Min(1) Long groupId) {
    List<UserResponsePublicDto> editors = groupAdminService.getEditors(groupId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", editors));
  }

  @PostMapping("editors")
  public ResponseEntity<?> addEditor(
    @PathVariable @Min(1) Long groupId, @RequestParam(name = "userId") @Min(1) Long userId,
    Locale locale) {
    groupAdminService.addEditor(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("group.editors.add.success", null, locale)));
  }

  @DeleteMapping("editors/{userId}")
  public ResponseEntity<?> removeEditor(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long userId, Locale locale) {
    groupAdminService.removeEditor(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("group.editors.remove.success", null, locale)));
  }

  @GetMapping("admins")
  public ResponseEntity<?> getAdmins(@PathVariable @Min(1) Long groupId) {
    List<UserResponsePublicDto> admins = groupAdminService.getAdmins(groupId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", admins));
  }

  @PostMapping("admins")
  public ResponseEntity<?> addAdmin(
    @PathVariable @Min(1) Long groupId, @RequestParam(name = "userId") @Min(1) Long userId,
    Locale locale) {
    groupAdminService.addAdmin(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("group.admins.add.success", null, locale)));
  }
}