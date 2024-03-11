package com.codecool.tasx.controller;

import com.codecool.tasx.dto.auth.*;
import com.codecool.tasx.dto.verification.VerificationTokenDto;
import com.codecool.tasx.service.auth.CookieService;
import com.codecool.tasx.service.auth.LocalUserAccountService;
import com.codecool.tasx.service.auth.RefreshService;
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
  private final LocalUserAccountService localUserAccountService;
  private final RefreshService refreshService;
  private final CookieService cookieService;


  @PostMapping("/register")
  public ResponseEntity<?> register(
    @RequestBody @Valid RegisterRequestDto request) throws Exception {
    localUserAccountService.sendRegistrationVerificationEmail(
      request);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of(
      "message",
      "Registration process started successfully, e-mail verification is required to proceed"));
  }

  @PostMapping("/verify-registration")
  public ResponseEntity<?> verifyRegistration(
    @RequestParam(name = "code") UUID verificationCode,
    @RequestParam(name = "id") @Min(1) Long verificationTokenId) {
    localUserAccountService.registerLocalAccount(
      new @Valid VerificationTokenDto(verificationTokenId, verificationCode));
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
      "message",
      "Local account registered successfully, sign in to proceed"));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(
    @RequestBody @Valid LoginRequestDto loginRequest, HttpServletResponse response) {
    LoginResponseDto loginResponse = localUserAccountService.loginLocalAccount(loginRequest);

    String refreshToken = refreshService.getNewRefreshToken(
      new TokenPayloadDto(
        loginResponse.userInfo().email(),
        loginResponse.userInfo().accountType()));
    cookieService.addRefreshCookie(refreshToken, response);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", loginResponse));
  }

  @GetMapping("/refresh")
  public ResponseEntity<?> refresh(@CookieValue @Length(min = 1) String jwt) {
    RefreshResponseDto refreshResponse = refreshService.refresh(new RefreshRequestDto(jwt));
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
      Map.of("message", "Account logged out successfully"));
  }
}
