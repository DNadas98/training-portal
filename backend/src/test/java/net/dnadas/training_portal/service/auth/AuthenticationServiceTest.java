package net.dnadas.training_portal.service.auth;

import jakarta.mail.MessagingException;
import net.dnadas.training_portal.dto.auth.PasswordResetRequestDto;
import net.dnadas.training_portal.dto.auth.RegisterRequestDto;
import net.dnadas.training_portal.dto.email.EmailRequestDto;
import net.dnadas.training_portal.dto.verification.VerificationTokenDto;
import net.dnadas.training_portal.exception.auth.InvalidCredentialsException;
import net.dnadas.training_portal.exception.auth.UserAlreadyExistsException;
import net.dnadas.training_portal.model.auth.ApplicationUser;
import net.dnadas.training_portal.model.auth.ApplicationUserDao;
import net.dnadas.training_portal.model.verification.*;
import net.dnadas.training_portal.service.email.EmailService;
import net.dnadas.training_portal.service.email.EmailTemplateService;
import net.dnadas.training_portal.service.verification.VerificationTokenService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.MailSendException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class AuthenticationServiceTest {
  private final List<ApplicationUser> testUsers = new ArrayList<>();
  @Mock
  private ApplicationUserDao applicationUserDao;
  @Mock
  private PasswordEncoder passwordEncoder;
  @Mock
  private RegistrationTokenDao registrationTokenDao;
  @Mock
  private VerificationTokenService verificationTokenService;
  @Mock
  private JwtService jwtService;
  @Mock
  private AuthenticationManager authenticationManager;
  @Mock
  private EmailService emailService;
  @Mock
  private EmailTemplateService emailTemplateService;
  @Mock
  private PasswordResetVerificationTokenDao passwordResetVerificationTokenDao;
  @Mock
  private EmailChangeVerificationTokenDao emailChangeVerificationTokenDao;

  @InjectMocks
  private AuthenticationService authenticationService;

  @BeforeEach
  void setUp() {
    MockitoAnnotations.openMocks(this);
    ApplicationUser testUser1 = new ApplicationUser("test1", "test1@test.test", "testpassword1");
    testUser1.setId(1L);
    ApplicationUser testUser2 = new ApplicationUser("test2", "test2@test.test", "testpassword2");
    testUser2.setId(2L);
    testUsers.add(testUser1);
    testUsers.add(testUser2);
  }

  @AfterEach
  void tearDown() {
    testUsers.clear();
  }


  @Test
  void sendRegistrationVerificationEmail_sends_email() throws Exception {
    RegisterRequestDto registerRequest = new RegisterRequestDto(
      "test1", "test1@test.test", "testpassword1");
    VerificationTokenDto verificationTokenDto = new VerificationTokenDto(1L, UUID.randomUUID());
    EmailRequestDto emailRequestDto = new EmailRequestDto("to", "subject", "content");

    when(applicationUserDao.findByEmailOrUsername(
      registerRequest.email(),
      registerRequest.username())).thenReturn(
      Optional.empty());
    when(registrationTokenDao.findByEmailOrUsername(
      registerRequest.email(),
      registerRequest.username())).thenReturn(
      Optional.empty());
    when(passwordEncoder.encode(registerRequest.password())).thenReturn("hashedPassword");
    when(passwordEncoder.encode(verificationTokenDto.verificationCode().toString())).thenReturn(
      "hashedCode");

    when(registrationTokenDao.save(any(RegistrationToken.class))).thenReturn(
      new RegistrationToken(emailRequestDto.to(), registerRequest.email(), "hashedPassword",
        "hashedCode"));
    when(emailTemplateService.getRegistrationEmailDto(verificationTokenDto, registerRequest.email(),
      registerRequest.username())).thenReturn(emailRequestDto);
    when(emailChangeVerificationTokenDao.findByNewEmail(registerRequest.email())).thenReturn(
      Optional.empty());

    assertDoesNotThrow(
      () -> authenticationService.sendRegistrationVerificationEmail(registerRequest));
  }

  @Test
  void sendRegistrationVerificationEmail_throws_exception_when_user_already_exists() {
    RegisterRequestDto registerRequest = new RegisterRequestDto(
      "test1@test.test", "test1", "testpassword1");

    when(applicationUserDao.findByEmailOrUsername(
      registerRequest.email(),
      registerRequest.username())).thenReturn(Optional.of(new ApplicationUser()));

    assertThrows(
      UserAlreadyExistsException.class,
      () -> authenticationService.sendRegistrationVerificationEmail(registerRequest));
  }

  @Test
  void sendPasswordResetVerificationEmail_sends_email() throws Exception {
    PasswordResetRequestDto requestDto = new PasswordResetRequestDto("test1@test.test");
    ApplicationUser user = new ApplicationUser("test1", "test1@test.test", "testpassword1");
    VerificationTokenDto verificationTokenDto = new VerificationTokenDto(1L, UUID.randomUUID());
    EmailRequestDto emailRequestDto = new EmailRequestDto("to", "subject", "content");

    when(applicationUserDao.findByEmail(requestDto.email())).thenReturn(Optional.of(user));
    when(passwordResetVerificationTokenDao.findByEmail(requestDto.email())).thenReturn(
      Optional.empty());
    when(passwordResetVerificationTokenDao.save(any(PasswordResetVerificationToken.class)))
      .thenReturn(new PasswordResetVerificationToken("to", "hashedCode"));
    when(emailTemplateService.getPasswordResetEmailDto(verificationTokenDto, requestDto.email(),
      user.getActualUsername())).thenReturn(emailRequestDto);
    doNothing().when(emailService).sendMailToUserAddress(emailRequestDto);

    assertDoesNotThrow(() -> authenticationService.sendPasswordResetVerificationEmail(requestDto));
    verify(passwordResetVerificationTokenDao, times(1)).save(
      any(PasswordResetVerificationToken.class));
  }

  @Test
  void sendPasswordResetVerificationEmail_does_not_throw_exception_when_user_not_found() {
    PasswordResetRequestDto requestDto = new PasswordResetRequestDto("test1@test.test");

    when(applicationUserDao.findByEmail(requestDto.email())).thenReturn(Optional.empty());

    assertDoesNotThrow(() -> authenticationService.sendPasswordResetVerificationEmail(requestDto));
  }

  @Test
  void sendPasswordResetVerificationEmail_does_not_throw_exception_when_mail_sending_failed()
    throws IOException, MessagingException {
    PasswordResetRequestDto requestDto = new PasswordResetRequestDto("test1@test.test");

    when(applicationUserDao.findByEmail(requestDto.email())).thenReturn(Optional.empty());
    when(passwordResetVerificationTokenDao.findByEmail(requestDto.email())).thenReturn(
      Optional.empty());
    when(passwordResetVerificationTokenDao.save(any(PasswordResetVerificationToken.class)))
      .thenReturn(new PasswordResetVerificationToken("to", "hashedCode"));
    when(emailTemplateService.getPasswordResetEmailDto(any(VerificationTokenDto.class),
      eq(requestDto.email()), anyString())).thenReturn(new EmailRequestDto(requestDto.email(),
      "subject", "content"));
    doThrow(new MailSendException("")).when(emailService).sendMailToUserAddress(
      any(EmailRequestDto.class));

    assertDoesNotThrow(() -> authenticationService.sendPasswordResetVerificationEmail(requestDto));
  }

  @Test
  void register_registers_with_valid_verificationToken() {
    VerificationTokenDto verificationTokenDto = new VerificationTokenDto(1L, UUID.randomUUID());
    RegistrationToken token = new RegistrationToken("to", "email", "hashedPassword", "hashedCode");

    when(verificationTokenService.getVerificationToken(verificationTokenDto)).thenReturn(token);
    when(applicationUserDao.save(any(ApplicationUser.class))).thenReturn(new ApplicationUser());

    assertDoesNotThrow(() -> authenticationService.register(verificationTokenDto));
    verify(applicationUserDao, times(1)).save(any(ApplicationUser.class));
    verify(verificationTokenService, times(1)).getVerificationToken(verificationTokenDto);
  }

  @Test
  void register_throws_InvalidCredentialsException_for_nonexistent_token() {
    VerificationTokenDto verificationTokenDto = new VerificationTokenDto(1L, UUID.randomUUID());

    when(verificationTokenService.getVerificationToken(verificationTokenDto)).thenThrow(
      InvalidCredentialsException.class);

    assertThrows(
      InvalidCredentialsException.class,
      () -> authenticationService.register(verificationTokenDto));
    verify(applicationUserDao, times(0)).save(any(ApplicationUser.class));
  }

  @Test
  void register_throws_InvalidCredentialsException_for_invalid_token() {
    VerificationTokenDto verificationTokenDto = new VerificationTokenDto(1L, UUID.randomUUID());
    RegistrationToken token = new RegistrationToken("to", "email", "hashedPassword", "hashedCode");
    when(verificationTokenService.getVerificationToken(verificationTokenDto)).thenReturn(
      token);
    doThrow(InvalidCredentialsException.class).when(verificationTokenService)
      .validateVerificationToken(verificationTokenDto, token);

    assertThrows(
      InvalidCredentialsException.class,
      () -> authenticationService.register(verificationTokenDto));
    verify(applicationUserDao, times(0)).save(any(ApplicationUser.class));
  }

  @Test
  void login() {

  }

  @Test
  void getNewRefreshToken() {
  }

  @Test
  void refresh() {
  }

  @Test
  void resetPassword() {
  }
}