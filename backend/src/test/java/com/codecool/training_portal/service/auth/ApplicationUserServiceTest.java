package com.codecool.training_portal.service.auth;

import com.codecool.training_portal.dto.email.EmailRequestDto;
import com.codecool.training_portal.dto.user.*;
import com.codecool.training_portal.dto.verification.VerificationTokenDto;
import com.codecool.training_portal.exception.auth.InvalidCredentialsException;
import com.codecool.training_portal.exception.auth.PasswordVerificationFailedException;
import com.codecool.training_portal.exception.auth.UserAlreadyExistsException;
import com.codecool.training_portal.exception.auth.UserNotFoundException;
import com.codecool.training_portal.exception.verification.VerificationTokenAlreadyExistsException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.ApplicationUserDao;
import com.codecool.training_portal.model.verification.EmailChangeVerificationToken;
import com.codecool.training_portal.model.verification.EmailChangeVerificationTokenDao;
import com.codecool.training_portal.service.converter.UserConverter;
import com.codecool.training_portal.service.email.EmailService;
import com.codecool.training_portal.service.email.EmailTemplateService;
import com.codecool.training_portal.service.verification.VerificationTokenService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@Service
class ApplicationUserServiceTest {
  @Mock
  private ApplicationUserDao applicationUserDao;
  @Mock
  private UserConverter userConverter;
  @Mock
  private UserProvider userProvider;
  @Mock
  private PasswordEncoder passwordEncoder;
  @Mock
  private EmailChangeVerificationTokenDao emailChangeVerificationTokenDao;
  @Mock
  private EmailService emailService;
  @Mock
  private EmailTemplateService emailTemplateService;
  @Mock
  private VerificationTokenService verificationTokenService;

  @InjectMocks
  private ApplicationUserService applicationUserService;

  private final List<ApplicationUser> testUsers = new ArrayList<>();

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
  void getOwnUserDetails_returns_correct_user() {
    ApplicationUser authenticatedUser = testUsers.get(0);
    UserResponsePrivateDto expectedResponse = new UserResponsePrivateDto(1L, "testUser");

    when(userProvider.getAuthenticatedUser()).thenReturn(authenticatedUser);
    when(userConverter.toUserResponsePrivateDto(authenticatedUser)).thenReturn(expectedResponse);
    UserResponsePrivateDto actualResponse = applicationUserService.getOwnUserDetails();

    assertEquals(expectedResponse, actualResponse);
  }

  @Test
  void getAllApplicationUsers_returns_list_of_ApplicationUsers() {
    when(applicationUserDao.findAll()).thenReturn(testUsers);
    List<UserResponsePublicDto> expectedResponse = new ArrayList<>();
    for (ApplicationUser user : testUsers) {
      expectedResponse.add(new UserResponsePublicDto(user.getId(), user.getUsername()));
    }
    when(userConverter.toUserResponsePublicDtos(testUsers)).thenReturn(expectedResponse);
    List<UserResponsePublicDto> actualResponse = applicationUserService.getAllApplicationUsers();

    assertEquals(expectedResponse, actualResponse);
  }

  @Test
  void getAllApplicationUsers_returns_empty_list() {
    when(applicationUserDao.findAll()).thenReturn(new ArrayList<>());
    List<UserResponsePublicDto> expectedResponse = new ArrayList<>();
    when(userConverter.toUserResponsePublicDtos(new ArrayList<>())).thenReturn(expectedResponse);
    List<UserResponsePublicDto> actualResponse = applicationUserService.getAllApplicationUsers();

    assertEquals(expectedResponse, actualResponse);
  }

  @Test
  void getApplicationUserById_returns_correct_user() {
    Long userId = 1L;
    ApplicationUser user = testUsers.get(0);
    UserResponsePrivateDto expectedResponse = new UserResponsePrivateDto(1L, "testUser");

    when(applicationUserDao.findById(userId)).thenReturn(java.util.Optional.of(user));
    when(userConverter.toUserResponsePrivateDto(user)).thenReturn(expectedResponse);
    UserResponsePrivateDto actualResponse = applicationUserService.getApplicationUserById(userId);

    assertEquals(expectedResponse, actualResponse);
  }

  @Test
  void getApplicationUserById_throws_UserNotFoundException() {
    Long userId = 3L;
    when(applicationUserDao.findById(userId)).thenReturn(java.util.Optional.empty());

    assertThrows(
      UserNotFoundException.class, () -> applicationUserService.getApplicationUserById(userId));
  }

  @Test
  void updateUsername_updates_username_when_password_correct() {
    ApplicationUser authenticatedUser = testUsers.get(0);
    UserUsernameUpdateDto updateDto = new UserUsernameUpdateDto("newUsername", "password");

    when(userProvider.getAuthenticatedUser()).thenReturn(authenticatedUser);
    when(passwordEncoder.matches(updateDto.password(), authenticatedUser.getPassword())).thenReturn(
      true);
    applicationUserService.updateUsername(updateDto);

    assertEquals(updateDto.username(), authenticatedUser.getActualUsername());
  }

  @Test
  void updateUsername_throws_PasswordVerificationFailedException_when_password_incorrect() {
    ApplicationUser authenticatedUser = testUsers.get(0);
    UserUsernameUpdateDto updateDto = new UserUsernameUpdateDto("newUsername", "password");

    when(userProvider.getAuthenticatedUser()).thenReturn(authenticatedUser);
    when(passwordEncoder.matches(updateDto.password(), authenticatedUser.getPassword())).thenReturn(
      false);

    assertThrows(
      PasswordVerificationFailedException.class,
      () -> applicationUserService.updateUsername(updateDto));
  }

  @Test
  void updatePassword_updates_password_to_new_hashed_password() {
    ApplicationUser authenticatedUser = testUsers.get(0);
    UserPasswordUpdateDto updateDto = new UserPasswordUpdateDto(authenticatedUser.getPassword(), "newPassword");

    when(userProvider.getAuthenticatedUser()).thenReturn(authenticatedUser);
    when(passwordEncoder.matches(anyString(),anyString())).thenReturn(
      true);
    applicationUserService.updatePassword(updateDto);

    verify(passwordEncoder).encode(updateDto.newPassword());
    assertNotEquals(authenticatedUser.getPassword(), updateDto.newPassword());
    verify(applicationUserDao).save(authenticatedUser);
  }

  @Test
  void updatePassword_throws_PasswordVerificationFailedException_when_password_incorrect() {
    ApplicationUser authenticatedUser = testUsers.get(0);
    UserPasswordUpdateDto updateDto = new UserPasswordUpdateDto("password", "newPassword");

    when(userProvider.getAuthenticatedUser()).thenReturn(authenticatedUser);
    when(passwordEncoder.matches(updateDto.password(), authenticatedUser.getPassword())).thenReturn(
      false);

    assertThrows(
      PasswordVerificationFailedException.class,
      () -> applicationUserService.updatePassword(updateDto));
  }

  @Test
  void archiveOwnApplicationUser_archives_user() {
    ApplicationUser authenticatedUser = testUsers.get(0);

    when(userProvider.getAuthenticatedUser()).thenReturn(authenticatedUser);
    applicationUserService.archiveOwnApplicationUser();

    assertTrue(authenticatedUser.getActualUsername().contains("archived"));
    assertTrue(authenticatedUser.getEmail().contains("archived"));
    assertEquals("", authenticatedUser.getPassword());
    assertFalse(authenticatedUser.isEnabled());
  }


  @Test
  void archiveApplicationUserById_archives_user() {
    ApplicationUser user = testUsers.get(0);
    Long userId = user.getId();

    when(applicationUserDao.findById(userId)).thenReturn(java.util.Optional.of(user));
    applicationUserService.archiveApplicationUserById(userId);

    assertTrue(user.getUsername().contains("archived"));
    assertTrue(user.getEmail().contains("archived"));
    assertEquals("", user.getPassword());
    assertFalse(user.isEnabled());
  }

  @Test
  void changeEmail_changes_email_when_verification_token_is_valid() {
    VerificationTokenDto verificationTokenDto = new VerificationTokenDto(1L, UUID.randomUUID());
    EmailChangeVerificationToken verificationToken = new EmailChangeVerificationToken(
      "newEmail@test.test", 1L, "hashedVerificationCode");
    ApplicationUser user = testUsers.get(0);

    when(verificationTokenService.getVerificationToken(verificationTokenDto)).thenReturn(
      verificationToken);
    when(applicationUserDao.findById(verificationToken.getUserId())).thenReturn(
      java.util.Optional.of(user));
    applicationUserService.changeEmail(verificationTokenDto);

    assertEquals("newEmail@test.test", user.getEmail());
  }

  @Test
  void changeEmail_throws_InvalidCredentialsException_when_user_not_found() {
    VerificationTokenDto verificationTokenDto = new VerificationTokenDto(1L, UUID.randomUUID());
    EmailChangeVerificationToken verificationToken = new EmailChangeVerificationToken(
      "newEmail@test.test", 1L, "hashedVerificationCode");

    when(verificationTokenService.getVerificationToken(verificationTokenDto)).thenReturn(
      verificationToken);
    when(applicationUserDao.findById(verificationToken.getUserId())).thenReturn(
      java.util.Optional.empty());

    assertThrows(
      InvalidCredentialsException.class,
      () -> applicationUserService.changeEmail(verificationTokenDto));
  }

  @Test
  void changeEmail_deletes_verification_token_after_successful_email_change() {
    VerificationTokenDto verificationTokenDto = new VerificationTokenDto(1L, UUID.randomUUID());
    EmailChangeVerificationToken verificationToken = new EmailChangeVerificationToken(
      "newEmail@test.test", 1L, "hashedVerificationCode");
    ApplicationUser user = testUsers.get(0);

    when(verificationTokenService.getVerificationToken(verificationTokenDto)).thenReturn(
      verificationToken);
    when(applicationUserDao.findById(verificationToken.getUserId())).thenReturn(
      java.util.Optional.of(user));
    applicationUserService.changeEmail(verificationTokenDto);

    verify(verificationTokenService).deleteVerificationToken(verificationToken.getId());
  }

  @Test
  void sendEmailChangeVerificationEmail_sends_verification_email_when_password_is_correct_and_email_is_not_taken()
    throws Exception {
    UserEmailUpdateDto updateDto = new UserEmailUpdateDto("newEmail@test.test", "testpassword1");
    ApplicationUser authenticatedUser = testUsers.get(0);
    UUID verificationCode = UUID.randomUUID();
    EmailChangeVerificationToken savedVerificationToken = new EmailChangeVerificationToken(
      "newEmail@test.test", 1L,
      verificationTokenService.getHashedVerificationCode(verificationCode));
    VerificationTokenDto verificationTokenDto = new VerificationTokenDto(
      savedVerificationToken.getId(), verificationCode);
    EmailRequestDto emailRequestDto = emailTemplateService.getEmailChangeVerificationEmailDto(
      verificationTokenDto, updateDto.email(), authenticatedUser.getActualUsername());

    when(userProvider.getAuthenticatedUser()).thenReturn(authenticatedUser);
    when(passwordEncoder.matches(updateDto.password(), authenticatedUser.getPassword())).thenReturn(
      true);
    when(applicationUserDao.findByEmail(updateDto.email())).thenReturn(Optional.empty());
    when(emailChangeVerificationTokenDao.findByNewEmailOrUserId(
      updateDto.email(),
      authenticatedUser.getId())).thenReturn(Optional.empty());
    when(emailChangeVerificationTokenDao.save(any(EmailChangeVerificationToken.class))).thenReturn(
      savedVerificationToken);
    doNothing().when(emailService).sendMailToUserAddress(emailRequestDto);

    applicationUserService.sendEmailChangeVerificationEmail(updateDto);

    verify(emailService).sendMailToUserAddress(emailRequestDto);
  }

  @Test
  void sendEmailChangeVerificationEmail_throws_PasswordVerificationFailedException_when_password_incorrect() {
    UserEmailUpdateDto updateDto = new UserEmailUpdateDto("newEmail@test.test", "wrongpassword");
    ApplicationUser authenticatedUser = testUsers.get(0);

    when(userProvider.getAuthenticatedUser()).thenReturn(authenticatedUser);
    when(passwordEncoder.matches(updateDto.password(), authenticatedUser.getPassword())).thenReturn(
      false);

    assertThrows(
      PasswordVerificationFailedException.class,
      () -> applicationUserService.sendEmailChangeVerificationEmail(updateDto));
  }

  @Test
  void sendEmailChangeVerificationEmail_throws_UserAlreadyExistsException_when_email_already_taken() {
    UserEmailUpdateDto updateDto = new UserEmailUpdateDto("test1@test.test", "testpassword1");
    ApplicationUser authenticatedUser = testUsers.get(0);

    when(userProvider.getAuthenticatedUser()).thenReturn(authenticatedUser);
    when(passwordEncoder.matches(updateDto.password(), authenticatedUser.getPassword())).thenReturn(
      true);
    when(applicationUserDao.findByEmail(updateDto.email())).thenReturn(
      Optional.of(authenticatedUser));

    assertThrows(
      UserAlreadyExistsException.class,
      () -> applicationUserService.sendEmailChangeVerificationEmail(updateDto));
  }

  @Test
  void sendEmailChangeVerificationEmail_throws_VerificationTokenAlreadyExistsException_when_token_already_exists() {
    UserEmailUpdateDto updateDto = new UserEmailUpdateDto("newEmail@test.test", "testpassword1");
    ApplicationUser authenticatedUser = testUsers.get(0);
    EmailChangeVerificationToken existingToken = new EmailChangeVerificationToken(
      "newEmail@test.test", 1L, "hashedVerificationCode");

    when(userProvider.getAuthenticatedUser()).thenReturn(authenticatedUser);
    when(passwordEncoder.matches(updateDto.password(), authenticatedUser.getPassword())).thenReturn(
      true);
    when(applicationUserDao.findByEmail(updateDto.email())).thenReturn(Optional.empty());
    when(emailChangeVerificationTokenDao.findByNewEmailOrUserId(
      updateDto.email(),
      authenticatedUser.getId())).thenReturn(Optional.of(existingToken));

    assertThrows(
      VerificationTokenAlreadyExistsException.class,
      () -> applicationUserService.sendEmailChangeVerificationEmail(updateDto));
  }
}