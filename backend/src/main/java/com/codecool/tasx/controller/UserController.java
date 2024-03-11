package com.codecool.tasx.controller;

import com.codecool.tasx.dto.user.UserResponsePrivateDto;
import com.codecool.tasx.dto.user.UserUsernameUpdateDto;
import com.codecool.tasx.service.user.ApplicationUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {
  private final ApplicationUserService applicationUserService;

  @GetMapping
  public ResponseEntity<?> getOwnApplicationUser() {
    UserResponsePrivateDto userDetails = applicationUserService.getOwnUserDetails();
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", userDetails));
  }

  @PatchMapping("/username")
  public ResponseEntity<?> updateOwnApplicationUser(
    @RequestBody @Valid UserUsernameUpdateDto updateDto) {
    UserResponsePrivateDto userDetails = applicationUserService.updateOwnUsername(
      updateDto.username());
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", userDetails));
  }

  @DeleteMapping
  public ResponseEntity<?> deleteOwnApplicationUser() {
    applicationUserService.deleteOwnApplicationUser();
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "Application user deleted successfully"));
  }
}
