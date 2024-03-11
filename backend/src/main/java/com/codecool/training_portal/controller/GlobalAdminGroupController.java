package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.group.GroupResponsePublicDTO;
import com.codecool.training_portal.service.group.GroupService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/v1/admin/groups")
@RequiredArgsConstructor
public class GlobalAdminGroupController {
    private final GroupService groupService;

  @GetMapping
  public ResponseEntity<?> getAllGroups() {
      List<GroupResponsePublicDTO> groups = groupService.getAllGroups();
      return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", groups));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteGroupById(@PathVariable @Min(1) Long id) {
      groupService.deleteGroup(id);
    return ResponseEntity.status(HttpStatus.OK).body(
            Map.of("message", "UserGroup with ID " + id + " deleted successfully"));
  }
}
