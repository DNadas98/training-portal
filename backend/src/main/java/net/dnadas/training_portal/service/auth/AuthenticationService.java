package net.dnadas.training_portal.service.auth;


import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.auth.*;
import net.dnadas.training_portal.dto.email.EmailRequestDto;
import net.dnadas.training_portal.dto.verification.VerificationTokenDto;
import net.dnadas.training_portal.exception.auth.InvalidCredentialsException;
import net.dnadas.training_portal.exception.auth.UnauthorizedException;
import net.dnadas.training_portal.exception.auth.UserAlreadyExistsException;
import net.dnadas.training_portal.exception.auth.UserNotFoundException;
import net.dnadas.training_portal.model.group.UserGroup;
import net.dnadas.training_portal.model.group.project.Project;
import net.dnadas.training_portal.model.group.project.questionnaire.Questionnaire;
import net.dnadas.training_portal.model.user.ApplicationUser;
import net.dnadas.training_portal.model.user.ApplicationUserDao;
import net.dnadas.training_portal.model.verification.PasswordResetVerificationToken;
import net.dnadas.training_portal.model.verification.RegistrationToken;
import net.dnadas.training_portal.service.utils.email.EmailService;
import net.dnadas.training_portal.service.utils.email.EmailTemplateService;
import net.dnadas.training_portal.service.utils.security.JwtService;
import net.dnadas.training_portal.service.verification.VerificationTokenService;
import org.springframework.mail.MailSendException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
  private final ApplicationUserDao applicationUserDao;
  private final PasswordEncoder passwordEncoder;
  private final VerificationTokenService verificationTokenService;
  private final JwtService jwtService;
  private final AuthenticationManager authenticationManager;
  private final EmailService emailService;
  private final EmailTemplateService emailTemplateService;

  @Transactional(rollbackFor = Exception.class)
  public void sendRegistrationVerificationEmail(RegisterRequestDto registerRequest, Locale locale)
    throws Exception {
    VerificationTokenDto verificationTokenDto = null;
    try {
      String email = registerRequest.email();
      String username = registerRequest.username();
      String fullName = registerRequest.fullName();
      applicationUserDao.findByEmailOrUsername(email, username).ifPresent(user -> {
        throw new UserAlreadyExistsException();
      });
      verificationTokenService.verifyTokenDoesNotExistWith(email, username);
      String hashedPassword = passwordEncoder.encode(registerRequest.password());
      verificationTokenDto = verificationTokenService.saveRegistrationToken(
        registerRequest, hashedPassword);
      EmailRequestDto emailRequestDto = emailTemplateService.getRegistrationEmailDto(
        verificationTokenDto, email, fullName, locale);
      emailService.sendMailToUserAddress(emailRequestDto);
    } catch (Exception e) {
      verificationTokenService.cleanupVerificationToken(verificationTokenDto);
      throw e;
    }
  }

  @Transactional(rollbackFor = Exception.class)
  public void sendPasswordResetVerificationEmail(PasswordResetRequestDto requestDto, Locale locale)
    throws Exception {
    VerificationTokenDto verificationTokenDto = null;
    try {
      ApplicationUser user = applicationUserDao.findByEmail(requestDto.email()).orElseThrow(
        UserNotFoundException::new);
      verificationTokenService.verifyNoPasswordResetTokenWithEmail(requestDto.email());
      verificationTokenDto = verificationTokenService.savePasswordResetToken(requestDto);
      EmailRequestDto emailRequestDto = emailTemplateService.getPasswordResetEmailDto(
        verificationTokenDto, requestDto.email(), user.getFullName(), locale);
      emailService.sendMailToUserAddress(emailRequestDto);
    } catch (Exception e) {
      verificationTokenService.cleanupVerificationToken(verificationTokenDto);
      // User has to receive identical message whether the email exists or not
      if (!(e instanceof UserNotFoundException) && !(e instanceof MailSendException)) {
        throw e;
      }
    }
  }

  @Transactional(rollbackFor = Exception.class)
  public void register(VerificationTokenDto verificationTokenDto) {
    RegistrationToken token = (RegistrationToken) verificationTokenService.findVerificationToken(
      verificationTokenDto);
    verificationTokenService.validateVerificationToken(verificationTokenDto, token);
    ApplicationUser user = new ApplicationUser(token.getUsername(), token.getEmail(),
      token.getPassword(), token.getFullName());
    applicationUserDao.save(user);
    verificationTokenService.deleteVerificationToken(token.getId());
  }

  @Transactional(readOnly = true)
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

    Optional<Questionnaire> activeQuestionnaire = Optional.ofNullable(
      user.getActiveQuestionnaire());
    if (activeQuestionnaire.isPresent()) {
      return getLoginResponseWithActiveQuestionnaire(activeQuestionnaire.get(), accessToken, user);
    }

    return new LoginResponseDto(
      accessToken,
      new UserInfoDto(
        user.getActualUsername(), user.getEmail(), user.getFullName(), user.getGlobalRoles()));
  }

  private LoginResponseDto getLoginResponseWithActiveQuestionnaire(
    Questionnaire questionnaire, String accessToken, ApplicationUser user) {
    Project project = questionnaire.getProject();
    UserGroup group = project.getUserGroup();
    return new LoginResponseDto(
      accessToken,
      new UserInfoDto(
        user.getActualUsername(), user.getEmail(), user.getFullName(), user.getGlobalRoles()),
      group.getId(), project.getId(), questionnaire.getId());
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
      new UserInfoDto(
        user.getActualUsername(), user.getEmail(), user.getFullName(), user.getGlobalRoles()));
  }

  @Transactional(rollbackFor = Exception.class)
  public void resetPassword(
    VerificationTokenDto verificationTokenDto, PasswordResetDto passwordResetDto) {
    PasswordResetVerificationToken token =
      (PasswordResetVerificationToken) verificationTokenService.findVerificationToken(
        verificationTokenDto);
    ApplicationUser user = applicationUserDao.findByEmail(token.getEmail()).orElseThrow(
      InvalidCredentialsException::new);
    user.setPassword(passwordEncoder.encode(passwordResetDto.newPassword()));
    applicationUserDao.save(user);
    verificationTokenService.deleteVerificationToken(token.getId());
  }
}

