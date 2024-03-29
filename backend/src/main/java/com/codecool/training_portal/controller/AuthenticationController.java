package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.auth.*;
import com.codecool.training_portal.dto.verification.VerificationTokenDto;
import com.codecool.training_portal.service.auth.AuthenticationService;
import com.codecool.training_portal.service.auth.CookieService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.constraints.Length;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
  private final AuthenticationService authenticationService;
  private final CookieService cookieService;
  private final MessageSource messageSource;

  @PostMapping("/register")
  public ResponseEntity<?> register(
    @RequestBody @Valid RegisterRequestDto request, Locale locale) throws Exception {
    authenticationService.sendRegistrationVerificationEmail(
      request);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of(
      "message",
      messageSource.getMessage("auth.registration.started", null, locale)));
  }

  @PostMapping("/reset-password")
  public ResponseEntity<?> resetPassword(
    @RequestBody @Valid PasswordResetRequestDto requestDto, Locale locale) throws Exception {
    authenticationService.sendPasswordResetVerificationEmail(requestDto);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of(
      "message",
      messageSource.getMessage("auth.password.reset.started", null, locale)));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(
    @RequestBody @Valid LoginRequestDto loginRequest, HttpServletResponse response) {
    LoginResponseDto loginResponse = authenticationService.login(loginRequest);
    String refreshToken = authenticationService.getNewRefreshToken(
      new TokenPayloadDto(loginResponse.userInfo().email()));
    cookieService.addRefreshCookie(refreshToken, response);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", loginResponse));
  }

  @GetMapping("/refresh")
  public ResponseEntity<?> refresh(@CookieValue @Length(min = 1) String jwt) {
    RefreshResponseDto refreshResponse = authenticationService.refresh(new RefreshRequestDto(jwt));
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", refreshResponse));
  }

  @GetMapping("/logout")
  public ResponseEntity<?> logout(
    @CookieValue(required = false) String jwt, HttpServletResponse response,
    Locale locale) {
    if (jwt == null) {
      return ResponseEntity.noContent().build();
    }
    cookieService.clearRefreshCookie(response);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("auth.logout.success", null, locale)));
  }
}
