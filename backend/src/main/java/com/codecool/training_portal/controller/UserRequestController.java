package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.requests.CompanyJoinRequestResponseDto;
import com.codecool.training_portal.dto.requests.ProjectJoinRequestResponseDto;
import com.codecool.training_portal.service.company.CompanyRequestService;
import com.codecool.training_portal.service.company.project.ProjectRequestService;
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
@RequestMapping("/api/v1/user/")
@RequiredArgsConstructor
public class UserRequestController {
  private final CompanyRequestService companyRequestService;
  private final ProjectRequestService projectRequestService;

  @GetMapping("/company-requests")
  public ResponseEntity<?> getJoinRequestsOfUser() {
    List<CompanyJoinRequestResponseDto> joinRequests = companyRequestService.getOwnJoinRequests();
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", joinRequests));
  }

  @DeleteMapping("/company-requests/{requestId}")
  public ResponseEntity<?> deleteOwnJoinRequest(@PathVariable @Min(1) Long requestId) {
    companyRequestService.deleteOwnJoinRequestById(requestId);
    return ResponseEntity.status(HttpStatus.CREATED).body(
      Map.of("message", "Request deleted successfully"));
  }

  @GetMapping("/project-requests")
  public ResponseEntity<?> getProjectJoinRequestOfUser() {
    List<ProjectJoinRequestResponseDto> projectJoinRequests =
      projectRequestService.getOwnJoinRequests();
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", projectJoinRequests));
  }

  @DeleteMapping("/project-requests/{requestId}")
  public ResponseEntity<?> deleteOwnProjectJoinRequest(@PathVariable @Min(1) Long requestId) {
    projectRequestService.deleteOwnJoinRequestById(requestId);
    return ResponseEntity.status(HttpStatus.CREATED).body(
      Map.of("message", "Request deleted successfully"));
  }
}
