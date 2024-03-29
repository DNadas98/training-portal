package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.group.GroupResponsePrivateDTO;
import com.codecool.training_portal.dto.group.GroupResponsePublicDTO;
import com.codecool.training_portal.dto.group.GroupUpdateRequestDto;
import com.codecool.training_portal.service.group.GroupService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/groups")
@RequiredArgsConstructor
public class GroupController {
    private final GroupService groupService;
    private final MessageSource messageSource;

    @GetMapping()
    public ResponseEntity<?> getAllGroups(
            @RequestParam(name = "withUser") Boolean withUser) {
        List<@Valid GroupResponsePublicDTO> groups;
        if (withUser) {
            groups = groupService.getGroupsWithUser();
        } else {
            groups = groupService.getGroupsWithoutUser();
        }
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", groups));
    }

  @GetMapping("/{groupId}/details")
  public ResponseEntity<?> getGroupDetailsById(@PathVariable @Min(1) Long groupId) {
    GroupResponsePrivateDTO group = groupService.getGroupDetailsById(groupId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", group));
  }

  @GetMapping("/{groupId}")
  public ResponseEntity<?> getGroupById(@PathVariable @Min(1) Long groupId) {
    GroupResponsePublicDTO group = groupService.getGroupById(groupId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", group));
  }

    @PutMapping("/{groupId}")
    public ResponseEntity<?> updateGroup(
            @PathVariable @Min(1) Long groupId,
            @RequestBody @Valid GroupUpdateRequestDto updateRequestDto, Locale locale) {
        GroupResponsePrivateDTO groupResponseDetails = groupService.updateGroup(
                updateRequestDto, groupId);

        return ResponseEntity.status(HttpStatus.OK).body(
                Map.of("message",
                        messageSource.getMessage("group.update.success",null,locale),
                        "data", groupResponseDetails));
    }
}