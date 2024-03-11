package com.codecool.tasx.controller;

import com.codecool.tasx.dto.requests.CompanyJoinRequestResponseDto;
import com.codecool.tasx.dto.requests.CompanyJoinRequestUpdateDto;
import com.codecool.tasx.service.company.CompanyRequestService;
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
@RequestMapping("/api/v1/companies/{companyId}/requests")
public class CompanyRequestController {
  private final CompanyRequestService requestService;

  @GetMapping()
  public ResponseEntity<?> readJoinRequestsOfCompany(
    @PathVariable @Min(1) Long companyId) {

    List<CompanyJoinRequestResponseDto> requests = requestService.getJoinRequestsOfCompany(
      companyId);

    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", requests));
  }

  @PostMapping()
  public ResponseEntity<?> joinCompany(@PathVariable @Min(1) Long companyId) {
    CompanyJoinRequestResponseDto createdRequest = requestService.createJoinRequest(companyId);

    return ResponseEntity.status(HttpStatus.CREATED).body(
      Map.of("message", "Request created successfully", "data", createdRequest));
  }

  @PutMapping("/{requestId}")
  public ResponseEntity<?> updateJoinRequestById(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long requestId,
    @RequestBody @Valid CompanyJoinRequestUpdateDto requestDto) {

    requestService.handleJoinRequest(companyId, requestId, requestDto);

    //TODO: notify the user who requested to join...
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Request updated successfully"));
  }
}