package com.codecool.tasx.controller;

import com.codecool.tasx.dto.user.UserResponsePrivateDto;
import com.codecool.tasx.dto.user.UserResponsePublicDto;
import com.codecool.tasx.service.user.ApplicationUserService;
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
@RequestMapping("/api/v1/admin/users")
@RequiredArgsConstructor
public class GlobalAdminUserController {
  private final ApplicationUserService applicationUserService;

  @GetMapping
  public ResponseEntity<?> getAllApplicationUsers() {
    List<UserResponsePublicDto> users = applicationUserService.getAllApplicationUsers();
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", users));
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getApplicationUserById(@PathVariable @Min(1) Long id) {
    UserResponsePrivateDto user = applicationUserService.getApplicationUserById(id);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", user));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteApplicationUserById(@PathVariable @Min(1) Long id) {
    applicationUserService.deleteApplicationUserById(id);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Application user with ID " + id + " deleted successfully"));
  }
}
