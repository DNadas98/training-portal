package net.dnadas.training_portal.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.user.UserEmailUpdateDto;
import net.dnadas.training_portal.dto.user.UserFullNameUpdateDto;
import net.dnadas.training_portal.dto.user.UserPasswordUpdateDto;
import net.dnadas.training_portal.dto.user.UserResponsePrivateDto;
import net.dnadas.training_portal.service.user.ApplicationUserService;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;
import java.util.Map;

@RestController
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

  @PatchMapping("/fullName")
  public ResponseEntity<?> updateFullName(
    @RequestBody @Valid UserFullNameUpdateDto updateDto, Locale locale) {
    applicationUserService.updateFullName(updateDto);
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
    applicationUserService.sendEmailChangeVerificationEmail(updateDto, locale);
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
