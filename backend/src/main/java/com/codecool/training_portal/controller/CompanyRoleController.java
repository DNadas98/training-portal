package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.user.UserResponsePublicDto;
import com.codecool.training_portal.service.company.CompanyRoleService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/companies/{companyId}")
public class CompanyRoleController {
  private final CompanyRoleService companyRoleService;

  @GetMapping("employees")
  public ResponseEntity<?> getEmployees(@PathVariable @Min(1) Long companyId) {
    List<UserResponsePublicDto> employees = companyRoleService.getEmployees(companyId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", employees));
  }

  @PostMapping("employees")
  public ResponseEntity<?> addEmployee(
    @PathVariable @Min(1) Long companyId, @RequestParam(name = "userId") @Min(1) Long userId) {
    companyRoleService.addEmployee(companyId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Employee added successfully"));
  }

  @DeleteMapping("employees/{userId}")
  public ResponseEntity<?> removeEmployee(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long userId) {
    companyRoleService.removeEmployee(companyId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Employee removed successfully"));
  }

  @GetMapping("editors")
  public ResponseEntity<?> getEditors(@PathVariable @Min(1) Long companyId) {
    List<UserResponsePublicDto> editors = companyRoleService.getEditors(companyId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", editors));
  }

  @PostMapping("editors")
  public ResponseEntity<?> addEditor(
    @PathVariable @Min(1) Long companyId, @RequestParam(name = "userId") @Min(1) Long userId) {
    companyRoleService.addEditor(companyId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Editor added successfully"));
  }

  @DeleteMapping("editors/{userId}")
  public ResponseEntity<?> removeEditor(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long userId) {
    companyRoleService.removeEditor(companyId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Editor removed successfully"));
  }

  @GetMapping("admins")
  public ResponseEntity<?> getAdmins(@PathVariable @Min(1) Long companyId) {
    List<UserResponsePublicDto> admins = companyRoleService.getAdmins(companyId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", admins));
  }

  @PostMapping("admins")
  public ResponseEntity<?> addAdmin(
    @PathVariable @Min(1) Long companyId, @RequestParam(name = "userId") @Min(1) Long userId) {
    companyRoleService.addAdmin(companyId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Admin added successfully"));
  }

  @DeleteMapping("admins/{userId}")
  public ResponseEntity<?> removeAdmin(
    @PathVariable @Min(1) Long companyId, @PathVariable @Min(1) Long userId) {
    companyRoleService.removeAdmin(companyId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Admin removed successfully"));
  }
}