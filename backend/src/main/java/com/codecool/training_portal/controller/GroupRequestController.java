package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.requests.GroupJoinRequestResponseDto;
import com.codecool.training_portal.dto.requests.GroupJoinRequestUpdateDto;
import com.codecool.training_portal.service.group.GroupRequestService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/groups/{groupId}/requests")
public class GroupRequestController {
    private final GroupRequestService requestService;

    @GetMapping()
    public ResponseEntity<?> readJoinRequestsOfGroup(
            @PathVariable @Min(1) Long groupId) {

        List<GroupJoinRequestResponseDto> requests = requestService.getJoinRequestsOfGroup(
                groupId);

        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", requests));
    }

    @PostMapping()
    public ResponseEntity<?> joinGroup(@PathVariable @Min(1) Long groupId) {
        GroupJoinRequestResponseDto createdRequest = requestService.createJoinRequest(groupId);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("message", "Request created successfully", "data", createdRequest));
    }

    @PutMapping("/{requestId}")
    public ResponseEntity<?> updateJoinRequestById(
            @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long requestId,
            @RequestBody @Valid GroupJoinRequestUpdateDto requestDto) {

        requestService.handleJoinRequest(groupId, requestId, requestDto);
        return ResponseEntity.status(HttpStatus.OK).body(
                Map.of("message", "Request updated successfully"));
    }
}