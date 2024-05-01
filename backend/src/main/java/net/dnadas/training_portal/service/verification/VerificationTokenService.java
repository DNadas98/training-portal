package net.dnadas.training_portal.service.verification;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.auth.PasswordResetRequestDto;
import net.dnadas.training_portal.dto.auth.RegisterRequestDto;
import net.dnadas.training_portal.dto.user.PreRegisterUserInternalDto;
import net.dnadas.training_portal.dto.user.UserEmailUpdateDto;
import net.dnadas.training_portal.dto.verification.VerificationTokenDto;
import net.dnadas.training_portal.exception.auth.InvalidCredentialsException;
import net.dnadas.training_portal.exception.auth.UserAlreadyExistsException;
import net.dnadas.training_portal.exception.verification.VerificationTokenAlreadyExistsException;
import net.dnadas.training_portal.model.user.ApplicationUser;
import net.dnadas.training_portal.model.verification.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationTokenService {
  private final VerificationTokenDao verificationTokenDao;
  private final PasswordEncoder tokenCodeEncoder = new BCryptPasswordEncoder(6);
  private final PreRegistrationVerificationTokenDao preRegistrationVerificationTokenDao;
  private final EmailChangeVerificationTokenDao emailChangeVerificationTokenDao;
  private final RegistrationTokenDao registrationTokenDao;
  private final PasswordResetVerificationTokenDao passwordResetVerificationTokenDao;

  public String getHashedVerificationCode(UUID verificationCode) {
    String hashedVerificationCode = tokenCodeEncoder.encode(verificationCode.toString());
    return hashedVerificationCode;
  }

  public VerificationToken findVerificationToken(VerificationTokenDto tokenDto) {
    VerificationToken token = verificationTokenDao.findById(tokenDto.id()).orElseThrow(
      InvalidCredentialsException::new);
    if (token.getVerificationCodeHash() == null || !tokenCodeEncoder.matches(
      tokenDto.verificationCode().toString(), token.getVerificationCodeHash())) {
      throw new InvalidCredentialsException();
    }
    return token;
  }

  public void validateVerificationToken(
    VerificationTokenDto verificationTokenDto, VerificationToken token) {
    if (!tokenCodeEncoder.matches(
      verificationTokenDto.verificationCode().toString(), token.getVerificationCodeHash())) {
      throw new InvalidCredentialsException();
    }
  }

  public void cleanupVerificationToken(VerificationTokenDto verificationTokenDto) {
    if (verificationTokenDto != null && verificationTokenDto.id() != null) {
      deleteVerificationToken(verificationTokenDto.id());
    }
  }

  public void deleteVerificationToken(Long tokenId) {
    verificationTokenDao.deleteById(tokenId);
  }

  public void verifyTokenDoesNotExistWith(String email) {
    emailChangeVerificationTokenDao.findByNewEmail(email).ifPresent(token -> {
      throw new UserAlreadyExistsException();
    });
    registrationTokenDao.findByEmail(email).ifPresent(token -> {
      throw new UserAlreadyExistsException();
    });
    preRegistrationVerificationTokenDao.findByEmail(email).ifPresent(token -> {
      throw new UserAlreadyExistsException();
    });
  }

  public void verifyTokenDoesNotExistWith(String email, String username) {
    emailChangeVerificationTokenDao.findByNewEmail(email).ifPresent(token -> {
      throw new UserAlreadyExistsException();
    });
    registrationTokenDao.findByEmailOrUsername(email, username).ifPresent(token -> {
      throw new UserAlreadyExistsException();
    });
    preRegistrationVerificationTokenDao.findByEmailOrUsername(email, username).ifPresent(token -> {
      throw new UserAlreadyExistsException();
    });
  }

  //Registration

  public VerificationTokenDto saveRegistrationToken(
    RegisterRequestDto registerRequest, String hashedPassword) {
    UUID verificationCode = UUID.randomUUID();
    String hashedVerificationCode = getHashedVerificationCode(
      verificationCode);
    RegistrationToken registrationToken = new RegistrationToken(registerRequest.email(),
      registerRequest.username(), registerRequest.fullName(), hashedPassword,
      hashedVerificationCode);
    RegistrationToken savedToken = registrationTokenDao.save(registrationToken);
    return new VerificationTokenDto(savedToken.getId(), verificationCode);
  }

  // E-mail change

  public void verifyNoEmailChangeTokenWithId(Long userId) {
    emailChangeVerificationTokenDao.findByUserId(
      userId).ifPresent(token -> {
      throw new VerificationTokenAlreadyExistsException();
    });
  }

  public VerificationTokenDto saveEmailChangeVerificationToken(
    UserEmailUpdateDto updateDto, ApplicationUser applicationUser) {
    UUID verificationCode = UUID.randomUUID();
    String hashedVerificationCode = getHashedVerificationCode(
      verificationCode);
    EmailChangeVerificationToken savedVerificationToken = emailChangeVerificationTokenDao.save(
      new EmailChangeVerificationToken(updateDto.email(), applicationUser.getId(),
        hashedVerificationCode));
    return new VerificationTokenDto(savedVerificationToken.getId(), verificationCode);
  }

  //Password reset

  public void verifyNoPasswordResetTokenWithEmail(String email) {
    Optional<PasswordResetVerificationToken> existingToken =
      passwordResetVerificationTokenDao.findByEmail(email);
    if (existingToken.isPresent()) {
      throw new VerificationTokenAlreadyExistsException();
    }
  }

  public VerificationTokenDto savePasswordResetToken(PasswordResetRequestDto requestDto) {
    UUID verificationCode = UUID.randomUUID();
    String hashedVerificationCode = getHashedVerificationCode(
      verificationCode);
    PasswordResetVerificationToken token = new PasswordResetVerificationToken(
      requestDto.email(), hashedVerificationCode);
    PasswordResetVerificationToken savedToken = passwordResetVerificationTokenDao.save(token);
    return new VerificationTokenDto(savedToken.getId(), verificationCode);
  }

  //Pre-registration

  public VerificationTokenDto savePreRegistrationVerificationToken(
    PreRegisterUserInternalDto userRequest, Long groupId, Long projectId,
    Long questionnaireId, Instant expiresAt) {
    UUID verificationCode = UUID.randomUUID();
    String hashedVerificationCode = getHashedVerificationCode(verificationCode);
    PreRegistrationVerificationToken token =
      new PreRegistrationVerificationToken(userRequest.email(), userRequest.username(), groupId,
        projectId, questionnaireId, hashedVerificationCode, expiresAt, userRequest.fullName());
    token.setCurrentCoordinatorFullName(userRequest.coordinatorName());
    token.setDataPreparatorFullName(userRequest.dataPreparatorName());
    token.setHasExternalTestQuestionnaire(userRequest.hasExternalTestQuestionnaire());
    token.setHasExternalTestFailure(userRequest.hasExternalTestFailure());
    token.setGroupPermissions(userRequest.groupPermissions());
    token.setProjectPermissions(userRequest.projectPermissions());
    preRegistrationVerificationTokenDao.save(token);
    return new VerificationTokenDto(token.getId(), verificationCode);
  }
}
