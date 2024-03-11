package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.group.GroupCreateRequestDto;
import com.codecool.training_portal.dto.group.GroupResponsePrivateDTO;
import com.codecool.training_portal.dto.group.GroupResponsePublicDTO;
import com.codecool.training_portal.service.group.GroupRoleService;
import com.codecool.training_portal.service.group.GroupService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/v1/admin/groups")
@RequiredArgsConstructor
public class GlobalAdminGroupController {
    private final GroupService groupService;
    private final GroupRoleService groupRoleService;

    @GetMapping
    public ResponseEntity<?> getAllGroups() {
        List<GroupResponsePublicDTO> groups = groupService.getAllGroups();
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", groups));
    }

    @PostMapping
    public ResponseEntity<?> createGroup(
            @RequestBody @Valid GroupCreateRequestDto createRequestDto) {
        GroupResponsePrivateDTO groupResponseDetails = groupService.createGroup(
                createRequestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("message", "UserGroup created successfully", "data", groupResponseDetails));
    }

    @DeleteMapping("/{groupId}/admins/{userId}")
    public ResponseEntity<?> removeAdmin(
            @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long userId) {
        groupRoleService.removeAdmin(groupId, userId);
        return ResponseEntity.status(HttpStatus.OK).body(
                Map.of("message", "Admin removed successfully"));
    }

    @DeleteMapping("/{groupId}")
    public ResponseEntity<?> deleteGroup(@PathVariable @Min(1) Long groupId) {
        groupService.deleteGroup(groupId);
        return ResponseEntity.status(HttpStatus.OK).body(
                Map.of("message", "UserGroup with ID " + groupId + " deleted successfully"));
    }
}
