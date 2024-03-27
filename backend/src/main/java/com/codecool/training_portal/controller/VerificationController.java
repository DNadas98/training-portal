package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.auth.PasswordResetDto;
import com.codecool.training_portal.dto.verification.VerificationTokenDto;
import com.codecool.training_portal.service.auth.ApplicationUserService;
import com.codecool.training_portal.service.auth.AuthenticationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@Controller
@RequestMapping("/api/v1/verification")
@RequiredArgsConstructor
public class VerificationController {
  private final ApplicationUserService applicationUserService;
  private final AuthenticationService authenticationService;
  private final MessageSource messageSource;

  @PostMapping("/registration")
  public ResponseEntity<?> verifyRegistration(
    @RequestParam(name = "code") UUID verificationCode,
    @RequestParam(name = "id") @Min(1) Long verificationTokenId,
    Locale locale) {
    authenticationService.register(
      new @Valid VerificationTokenDto(verificationTokenId, verificationCode));
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
      "message",
      messageSource.getMessage("auth.registration.success", null, locale)));
  }

  @PostMapping("/email-change")
  public ResponseEntity<?> verifyEmailChange(
    @RequestParam(name = "code") UUID verificationCode,
    @RequestParam(name = "id") @Min(1) Long verificationTokenId, Locale locale) {
    applicationUserService.changeEmail(
      new @Valid VerificationTokenDto(verificationTokenId, verificationCode));
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", messageSource.getMessage(
        "user.email.change.success", null, locale)));
  }

  @PostMapping("/password-reset")
  public ResponseEntity<?> verifyPasswordReset(
    @RequestParam(name = "code") UUID verificationCode,
    @RequestParam(name = "id") @Min(1) Long verificationTokenId, Locale locale,
    @RequestBody @Valid PasswordResetDto passwordResetDto) {
    authenticationService.resetPassword(new @Valid VerificationTokenDto(verificationTokenId, verificationCode),passwordResetDto);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", messageSource.getMessage(
        "auth.password.reset.success", null, locale)));
  }
}
