package com.codecool.training_portal.service.auth;

import com.codecool.training_portal.dto.email.EmailRequestDto;
import com.codecool.training_portal.dto.user.*;
import com.codecool.training_portal.dto.verification.VerificationTokenDto;
import com.codecool.training_portal.exception.auth.*;
import com.codecool.training_portal.exception.verification.VerificationTokenAlreadyExistsException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.ApplicationUserDao;
import com.codecool.training_portal.model.auth.GlobalRole;
import com.codecool.training_portal.model.verification.EmailChangeVerificationToken;
import com.codecool.training_portal.model.verification.EmailChangeVerificationTokenDao;
import com.codecool.training_portal.service.converter.UserConverter;
import com.codecool.training_portal.service.email.EmailService;
import com.codecool.training_portal.service.email.EmailTemplateService;
import com.codecool.training_portal.service.verification.VerificationTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ApplicationUserService {
  private final ApplicationUserDao applicationUserDao;
  private final UserConverter userConverter;
  private final UserProvider userProvider;
  private final PasswordEncoder passwordEncoder;
  private final EmailChangeVerificationTokenDao emailChangeVerificationTokenDao;
  private final EmailService emailService;
  private final EmailTemplateService emailTemplateService;
  private final VerificationTokenService verificationTokenService;

  public UserResponsePrivateDto getOwnUserDetails() throws UnauthorizedException {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    return userConverter.toUserResponsePrivateDto(applicationUser);
  }

  public List<UserResponsePublicDto> getAllApplicationUsers() {
    List<ApplicationUser> users = applicationUserDao.findAll();
    return userConverter.toUserResponsePublicDtos(users);
  }

  public UserResponsePrivateDto getApplicationUserById(Long userId) throws UnauthorizedException {
    ApplicationUser user = applicationUserDao.findById(userId).orElseThrow(
      () -> new UserNotFoundException(userId));
    return userConverter.toUserResponsePrivateDto(user);
  }

  @Transactional(rollbackFor = Exception.class)
  public void updateUsername(UserUsernameUpdateDto updateDto) {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    verifyPassword(updateDto.password(), applicationUser);
    applicationUser.setUsername(updateDto.username());
    applicationUserDao.save(applicationUser);
  }

  @Transactional(rollbackFor = Exception.class)
  public void updatePassword(UserPasswordUpdateDto updateDto) {
    ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
    verifyPassword(updateDto.password(), applicationUser);
    applicationUser.setPassword(passwordEncoder.encode(updateDto.newPassword()));
    applicationUserDao.save(applicationUser);
  }

  @Transactional(rollbackFor = Exception.class)
  public void archiveOwnApplicationUser() {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    String archived = UUID.randomUUID() + "archived";
    user.setUsername(archived);
    user.setEmail(archived + "@" + archived + ".net");
    user.setPassword("");
    user.setEnabled(false);
    applicationUserDao.save(user);
  }

  @Transactional(rollbackFor = Exception.class)
  public void archiveApplicationUserById(Long id) {
    ApplicationUser user = applicationUserDao.findById(id).orElseThrow(
      () -> new UserNotFoundException(id));
    if (user.getGlobalRoles().contains(GlobalRole.ADMIN)) {
      throw new UnauthorizedException();
    }
    String archived = UUID.randomUUID() + "archived";
    user.setUsername(archived);
    user.setEmail(archived + "@" + archived + ".net");
    user.setPassword("");
    user.setEnabled(false);
    applicationUserDao.save(user);
  }

  @Transactional(rollbackFor = Exception.class)
  public void sendEmailChangeVerificationEmail(UserEmailUpdateDto updateDto) throws Exception {
    VerificationTokenDto verificationTokenDto = null;
    try {
      ApplicationUser applicationUser = userProvider.getAuthenticatedUser();
      verifyPassword(updateDto.password(), applicationUser);

      verifyChangedEmail(updateDto, applicationUser);
      verifyEmailNotTaken(updateDto);
      verifyTokenDoesNotExist(updateDto, applicationUser);

      UUID verificationCode = UUID.randomUUID();
      EmailChangeVerificationToken savedVerificationToken = getEmailChangeVerificationToken(
        updateDto, applicationUser, verificationCode);
      verificationTokenDto = new VerificationTokenDto(
        savedVerificationToken.getId(),
        verificationCode);

      EmailRequestDto emailRequestDto = emailTemplateService.getEmailChangeVerificationEmailDto(
        verificationTokenDto, updateDto.email(), applicationUser.getActualUsername());

      emailService.sendMailToUserAddress(emailRequestDto);
    } catch (Exception e) {
      cleanUpVerificationToken(verificationTokenDto);
      throw e;
    }
  }

  private void verifyPassword(String password, ApplicationUser applicationUser) {
    if (password == null || !passwordEncoder.matches(
      password, applicationUser.getPassword())) {
      throw new PasswordVerificationFailedException();
    }
  }

  private EmailChangeVerificationToken getEmailChangeVerificationToken(
    UserEmailUpdateDto updateDto, ApplicationUser applicationUser, UUID verificationCode) {
    String hashedVerificationCode = verificationTokenService.getHashedVerificationCode(
      verificationCode);
    EmailChangeVerificationToken savedVerificationToken = emailChangeVerificationTokenDao.save(
      new EmailChangeVerificationToken(updateDto.email(), applicationUser.getId(),
        hashedVerificationCode));
    return savedVerificationToken;
  }

  private void cleanUpVerificationToken(VerificationTokenDto verificationTokenDto) {
    if (verificationTokenDto != null && verificationTokenDto.id() != null) {
      verificationTokenService.deleteVerificationToken(verificationTokenDto.id());
    }
  }

  private void verifyTokenDoesNotExist(
    UserEmailUpdateDto updateDto, ApplicationUser applicationUser) {
    emailChangeVerificationTokenDao.findByNewEmailOrUserId(
      updateDto.email(), applicationUser.getId()).ifPresent(token -> {
      throw new VerificationTokenAlreadyExistsException();
    });
  }

  private void verifyEmailNotTaken(UserEmailUpdateDto updateDto) {
    applicationUserDao.findByEmail(updateDto.email()).ifPresent(user -> {
      throw new UserAlreadyExistsException();
    });
  }

  private void verifyChangedEmail(
    UserEmailUpdateDto updateDto, ApplicationUser applicationUser) {
    if (applicationUser.getEmail().equals(updateDto.email())) {
      throw new UserAlreadyExistsException();
    }
  }

  @Transactional(rollbackFor = Exception.class)
  public void changeEmail(VerificationTokenDto verificationTokenDto) {
    EmailChangeVerificationToken verificationToken =
      (EmailChangeVerificationToken) verificationTokenService.getVerificationToken(
        verificationTokenDto);
    ApplicationUser user = applicationUserDao.findById(verificationToken.getUserId()).orElseThrow(
      InvalidCredentialsException::new);
    user.setEmail(verificationToken.getNewEmail());
    applicationUserDao.save(user);
    verificationTokenService.deleteVerificationToken(verificationToken.getId());
  }
}
