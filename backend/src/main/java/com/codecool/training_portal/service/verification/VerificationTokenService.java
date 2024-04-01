package com.codecool.training_portal.service.verification;

import com.codecool.training_portal.dto.verification.VerificationTokenDto;
import com.codecool.training_portal.exception.auth.InvalidCredentialsException;
import com.codecool.training_portal.model.verification.VerificationToken;
import com.codecool.training_portal.model.verification.VerificationTokenDao;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationTokenService {
  private final VerificationTokenDao verificationTokenDao;
  private final PasswordEncoder tokenCodeEncoder = new BCryptPasswordEncoder(6);

  public String getHashedVerificationCode(UUID verificationCode) {
    String hashedVerificationCode = tokenCodeEncoder.encode(verificationCode.toString());
    return hashedVerificationCode;
  }

  public VerificationToken getVerificationToken(VerificationTokenDto tokenDto) {
    VerificationToken token = verificationTokenDao.findById(tokenDto.id())
      .orElseThrow(InvalidCredentialsException::new);
    return token;
  }

  public void validateVerificationToken(
    VerificationTokenDto verificationTokenDto, VerificationToken token) {
    if (!tokenCodeEncoder.matches(
      verificationTokenDto.verificationCode().toString(), token.getVerificationCodeHash())) {
      throw new InvalidCredentialsException();
    }
  }

  public void deleteVerificationToken(Long tokenId) {
    verificationTokenDao.deleteById(tokenId);
  }
}
