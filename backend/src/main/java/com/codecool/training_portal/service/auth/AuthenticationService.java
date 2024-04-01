package com.codecool.training_portal.service.auth;


import com.codecool.training_portal.dto.auth.*;
import com.codecool.training_portal.dto.email.EmailRequestDto;
import com.codecool.training_portal.dto.verification.VerificationTokenDto;
import com.codecool.training_portal.exception.auth.InvalidCredentialsException;
import com.codecool.training_portal.exception.auth.UnauthorizedException;
import com.codecool.training_portal.exception.auth.UserAlreadyExistsException;
import com.codecool.training_portal.exception.auth.UserNotFoundException;
import com.codecool.training_portal.exception.verification.VerificationTokenAlreadyExistsException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.ApplicationUserDao;
import com.codecool.training_portal.model.verification.PasswordResetVerificationToken;
import com.codecool.training_portal.model.verification.PasswordResetVerificationTokenDao;
import com.codecool.training_portal.model.verification.RegistrationToken;
import com.codecool.training_portal.model.verification.RegistrationTokenDao;
import com.codecool.training_portal.service.email.EmailService;
import com.codecool.training_portal.service.email.EmailTemplateService;
import com.codecool.training_portal.service.verification.VerificationTokenService;
import lombok.AllArgsConstructor;
import org.springframework.mail.MailSendException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
public class AuthenticationService {
  private final ApplicationUserDao applicationUserDao;
  private final PasswordEncoder passwordEncoder;
  private final RegistrationTokenDao registrationTokenDao;
  private final VerificationTokenService verificationTokenService;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final EmailService emailService;
  private final EmailTemplateService emailTemplateService;
  private final PasswordResetVerificationTokenDao passwordResetVerificationTokenDao;

  @Transactional(rollbackFor = Exception.class)
  public void sendRegistrationVerificationEmail(RegisterRequestDto registerRequest)
    throws Exception {
    VerificationTokenDto verificationTokenDto = null;
    try {
      verifyUserDoesNotExist(registerRequest.email(), registerRequest.username());
      verifyRegistrationTokenDoesNotExist(registerRequest);
      String hashedPassword = passwordEncoder.encode(registerRequest.password());
      verificationTokenDto = saveRegistrationToken(registerRequest, hashedPassword);
      EmailRequestDto emailRequestDto = emailTemplateService.getRegistrationEmailDto(
        verificationTokenDto, registerRequest.email(), registerRequest.username());
      emailService.sendMailToUserAddress(emailRequestDto);
    } catch (Exception e) {
      cleanupVerificationToken(verificationTokenDto);
      throw e;
    }
  }

  @Transactional(rollbackFor = Exception.class)
  public void sendPasswordResetVerificationEmail(PasswordResetRequestDto requestDto)
    throws Exception {
    VerificationTokenDto verificationTokenDto = null;
    try {
      ApplicationUser user = applicationUserDao.findByEmail(requestDto.email()).orElseThrow(
        UserNotFoundException::new);
      verifyPasswordResetTokenDoesNotExist(requestDto);
      verificationTokenDto = savePasswordResetToken(requestDto);
      EmailRequestDto emailRequestDto = emailTemplateService.getPasswordResetEmailDto(
        verificationTokenDto, requestDto.email(), user.getActualUsername());
      emailService.sendMailToUserAddress(emailRequestDto);
    } catch (Exception e) {
      cleanupVerificationToken(verificationTokenDto);
      // User has to receive identical message whether the email exists or not
      if (!(e instanceof UserNotFoundException) && !(e instanceof MailSendException)) {
        throw e;
      }
    }
  }

  @Transactional(rollbackFor = Exception.class)
  public void register(VerificationTokenDto verificationTokenDto) {
    RegistrationToken token = (RegistrationToken) verificationTokenService.getVerificationToken(
      verificationTokenDto);
    verificationTokenService.validateVerificationToken(verificationTokenDto, token);
    ApplicationUser user = new ApplicationUser(token.getUsername(), token.getEmail(),
      token.getPassword());
    applicationUserDao.save(user);
    verificationTokenService.deleteVerificationToken(token.getId());
  }

  public LoginResponseDto login(LoginRequestDto loginRequest) {
    try {
      authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.password()));
    } catch (Exception e) {
      throw new InvalidCredentialsException();
    }
    ApplicationUser user = applicationUserDao.findByEmail(loginRequest.email()).orElseThrow(
      InvalidCredentialsException::new);
    TokenPayloadDto payloadDto = new TokenPayloadDto(user.getEmail());
    String accessToken = jwtService.generateAccessToken(payloadDto);
    return new LoginResponseDto(
      accessToken,
      new UserInfoDto(user.getActualUsername(), user.getEmail(), user.getGlobalRoles()));
  }


  public String getNewRefreshToken(TokenPayloadDto payloadDto) {
    return jwtService.generateRefreshToken(payloadDto);
  }

  @Transactional(readOnly = true)
  public RefreshResponseDto refresh(RefreshRequestDto refreshRequest) {
    String refreshToken = refreshRequest.refreshToken();
    TokenPayloadDto payload = jwtService.verifyRefreshToken(refreshToken);
    ApplicationUser user = applicationUserDao.findByEmail(payload.email()).orElseThrow(
      UnauthorizedException::new);
    String accessToken = jwtService.generateAccessToken(payload);
    return new RefreshResponseDto(
      accessToken,
      new UserInfoDto(user.getActualUsername(), user.getEmail(), user.getGlobalRoles()));
  }

  @Transactional(rollbackFor = Exception.class)
  public void resetPassword(
    VerificationTokenDto verificationTokenDto, PasswordResetDto passwordResetDto) {
    PasswordResetVerificationToken token =
      (PasswordResetVerificationToken) verificationTokenService.getVerificationToken(
        verificationTokenDto);
    ApplicationUser user = applicationUserDao.findByEmail(token.getEmail()).orElseThrow(
      InvalidCredentialsException::new);
    user.setPassword(passwordEncoder.encode(passwordResetDto.newPassword()));
    applicationUserDao.save(user);
    verificationTokenService.deleteVerificationToken(token.getId());
  }

  private void cleanupVerificationToken(VerificationTokenDto verificationTokenDto) {
    if (verificationTokenDto != null && verificationTokenDto.id() != null) {
      verificationTokenService.deleteVerificationToken(verificationTokenDto.id());
    }
  }

  private void verifyRegistrationTokenDoesNotExist(RegisterRequestDto registerRequest) {
    Optional<RegistrationToken> existingToken = registrationTokenDao.findByEmailOrUsername(
      registerRequest.email(), registerRequest.username());
    if (existingToken.isPresent()) {
      throw new UserAlreadyExistsException();
    }
  }

  private void verifyPasswordResetTokenDoesNotExist(PasswordResetRequestDto requestDto) {
    Optional<PasswordResetVerificationToken> existingToken =
      passwordResetVerificationTokenDao.findByEmail(requestDto.email());
    if (existingToken.isPresent()) {
      throw new VerificationTokenAlreadyExistsException();
    }
  }

  private void verifyUserDoesNotExist(String email, String username) {
    Optional<ApplicationUser> existingUser = applicationUserDao.findByEmailOrUsername(
      email,
      username);
    if (existingUser.isPresent()) {
      throw new UserAlreadyExistsException();
    }
  }

  private VerificationTokenDto saveRegistrationToken(
    RegisterRequestDto registerRequest, String hashedPassword) {
    UUID verificationCode = UUID.randomUUID();
    String hashedVerificationCode = verificationTokenService.getHashedVerificationCode(
      verificationCode);
    RegistrationToken registrationToken = new RegistrationToken(registerRequest.email(),
      registerRequest.username(), hashedPassword, hashedVerificationCode);
    RegistrationToken savedToken = registrationTokenDao.save(registrationToken);
    return new VerificationTokenDto(savedToken.getId(), verificationCode);
  }

  private VerificationTokenDto savePasswordResetToken(PasswordResetRequestDto requestDto) {
    UUID verificationCode = UUID.randomUUID();
    String hashedVerificationCode = verificationTokenService.getHashedVerificationCode(
      verificationCode);
    PasswordResetVerificationToken token = new PasswordResetVerificationToken(
      requestDto.email(), hashedVerificationCode);
    PasswordResetVerificationToken savedToken = passwordResetVerificationTokenDao.save(token);
    return new VerificationTokenDto(savedToken.getId(), verificationCode);
  }
}

