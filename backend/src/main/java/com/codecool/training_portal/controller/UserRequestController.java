package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.requests.GroupJoinRequestResponseDto;
import com.codecool.training_portal.dto.requests.ProjectJoinRequestResponseDto;
import com.codecool.training_portal.service.group.GroupRequestService;
import com.codecool.training_portal.service.group.project.ProjectRequestService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@Controller
@RequestMapping("/api/v1/user/")
@RequiredArgsConstructor
public class UserRequestController {
    private final GroupRequestService groupRequestService;
    private final ProjectRequestService projectRequestService;
    private final MessageSource messageSource;

    @GetMapping("/group-requests")
    public ResponseEntity<?> getJoinRequestsOfUser() {
        List<GroupJoinRequestResponseDto> joinRequests = groupRequestService.getOwnJoinRequests();
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", joinRequests));
    }

    @DeleteMapping("/group-requests/{requestId}")
    public ResponseEntity<?> deleteOwnJoinRequest(@PathVariable @Min(
            1) Long requestId, Locale locale) {
        groupRequestService.deleteOwnJoinRequestById(requestId);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("message",
                        messageSource.getMessage("user.group_requests.delete.success", null, locale)));
    }

    @GetMapping("/project-requests")
    public ResponseEntity<?> getProjectJoinRequestOfUser() {
        List<ProjectJoinRequestResponseDto> projectJoinRequests =
                projectRequestService.getOwnJoinRequests();
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", projectJoinRequests));
    }

    @DeleteMapping("/project-requests/{requestId}")
    public ResponseEntity<?> deleteOwnProjectJoinRequest(@PathVariable @Min(
            1) Long requestId, Locale locale) {
        projectRequestService.deleteOwnJoinRequestById(requestId);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of("message",
                        messageSource.getMessage("user.project_requests.delete.success", null, locale)));
    }
}
