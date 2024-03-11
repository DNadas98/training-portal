package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.auth.*;
import com.codecool.training_portal.dto.verification.VerificationTokenDto;
import com.codecool.training_portal.service.auth.AuthenticationService;
import com.codecool.training_portal.service.auth.CookieService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.constraints.Length;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
  private final AuthenticationService authenticationService;
  private final CookieService cookieService;


  @PostMapping("/register")
  public ResponseEntity<?> register(
    @RequestBody @Valid RegisterRequestDto request) throws Exception {
    authenticationService.sendRegistrationVerificationEmail(
      request);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of(
      "message",
      "Registration process started successfully, e-mail verification is required to proceed"));
  }

  @PostMapping("/verify-registration")
  public ResponseEntity<?> verifyRegistration(
    @RequestParam(name = "code") UUID verificationCode,
    @RequestParam(name = "id") @Min(1) Long verificationTokenId) {
    authenticationService.register(
      new @Valid VerificationTokenDto(verificationTokenId, verificationCode));
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
      "message",
      "User account registered successfully, sign in to proceed"));
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
    @CookieValue(required = false) String jwt, HttpServletResponse response) {
    if (jwt == null) {
      return ResponseEntity.noContent().build();
    }
    cookieService.clearRefreshCookie(response);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", "User account logged out successfully"));
  }
}
