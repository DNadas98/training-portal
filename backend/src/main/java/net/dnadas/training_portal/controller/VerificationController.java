package net.dnadas.training_portal.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.auth.*;
import net.dnadas.training_portal.dto.user.PreRegistrationCompleteInternalDto;
import net.dnadas.training_portal.dto.user.PreRegistrationDetailsResponseDto;
import net.dnadas.training_portal.dto.verification.VerificationTokenDto;
import net.dnadas.training_portal.service.auth.AuthenticationService;
import net.dnadas.training_portal.service.user.ApplicationUserService;
import net.dnadas.training_portal.service.user.PreRegistrationService;
import net.dnadas.training_portal.service.utils.security.CookieService;
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
  private final CookieService cookieService;
  private final PreRegistrationService preRegistrationService;
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
    authenticationService.resetPassword(
      new @Valid VerificationTokenDto(verificationTokenId, verificationCode), passwordResetDto);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("message", messageSource.getMessage(
        "auth.password.reset.success", null, locale)));
  }

  @GetMapping("/invitation-accept")
  public ResponseEntity<?> getPreRegistrationDetails(
    @RequestParam(name = "code") UUID verificationCode,
    @RequestParam(name = "id") @Min(1) Long verificationTokenId) {
    PreRegistrationDetailsResponseDto registrationDetailsDto = preRegistrationService
      .getPreRegistrationDetails(new @Valid VerificationTokenDto(
        verificationTokenId, verificationCode));

    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("data", registrationDetailsDto));
  }

  @PostMapping("/invitation-accept")
  public ResponseEntity<?> completePreRegistration(
    @RequestParam(name = "code") UUID verificationCode,
    @RequestParam(name = "id") @Min(1) Long verificationTokenId,
    @RequestBody @Valid PreRegistrationCompleteRequestDto requestDto,
    HttpServletResponse response) {
    PreRegistrationCompleteInternalDto registrationCompleteDto = preRegistrationService
      .completePreRegistration(new @Valid VerificationTokenDto(
        verificationTokenId, verificationCode), requestDto);

    LoginResponseDto loginResponse = authenticationService.login(new LoginRequestDto(
      registrationCompleteDto.email(), requestDto.password()));
    String refreshToken = authenticationService.getNewRefreshToken(
      new TokenPayloadDto(loginResponse.getUserInfo().email()));
    cookieService.addRefreshCookie(refreshToken, response);

    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of("data", loginResponse));
  }
}
