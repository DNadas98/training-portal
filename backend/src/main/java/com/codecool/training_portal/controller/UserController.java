package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.user.UserEmailUpdateDto;
import com.codecool.training_portal.dto.user.UserPasswordUpdateDto;
import com.codecool.training_portal.dto.user.UserResponsePrivateDto;
import com.codecool.training_portal.dto.user.UserUsernameUpdateDto;
import com.codecool.training_portal.service.auth.ApplicationUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;
import java.util.Map;

@Controller
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {
  private final ApplicationUserService applicationUserService;
  private final MessageSource messageSource;

  @GetMapping
  public ResponseEntity<?> getOwnApplicationUser() {
    UserResponsePrivateDto userDetails = applicationUserService.getOwnUserDetails();
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", userDetails));
  }

  @PatchMapping("/username")
  public ResponseEntity<?> updateUsername(
    @RequestBody @Valid UserUsernameUpdateDto updateDto, Locale locale) {
    applicationUserService.updateUsername(updateDto);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", messageSource.getMessage(
        "user.details.update.success", null, locale)));
  }

  @PatchMapping("/password")
  public ResponseEntity<?> updatePassword(
    @RequestBody @Valid UserPasswordUpdateDto updateDto, Locale locale) {
    applicationUserService.updatePassword(updateDto);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", messageSource.getMessage(
        "user.details.update.success", null, locale)));
  }

  @PatchMapping("/email")
  public ResponseEntity<?> requestEmailUpdate(
    @RequestBody @Valid UserEmailUpdateDto updateDto, Locale locale) throws Exception {
    applicationUserService.sendEmailChangeVerificationEmail(updateDto);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", messageSource.getMessage(
        "user.email.change.pending", null, locale)));
  }

  @DeleteMapping
  public ResponseEntity<?> deleteOwnApplicationUser(Locale locale) {
    applicationUserService.archiveOwnApplicationUser();
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", messageSource.getMessage("user.delete.success", null, locale)));
  }
}
