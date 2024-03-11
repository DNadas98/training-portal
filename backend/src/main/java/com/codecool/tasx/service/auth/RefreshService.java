package com.codecool.tasx.service.auth;


import com.codecool.tasx.dto.auth.RefreshRequestDto;
import com.codecool.tasx.dto.auth.RefreshResponseDto;
import com.codecool.tasx.dto.auth.TokenPayloadDto;
import com.codecool.tasx.dto.auth.UserInfoDto;
import com.codecool.tasx.exception.auth.UnauthorizedException;
import com.codecool.tasx.model.auth.account.UserAccount;
import com.codecool.tasx.model.auth.account.UserAccountDao;
import com.codecool.tasx.model.user.ApplicationUser;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class RefreshService {
  private final UserAccountDao accountDao;
  private final JwtService jwtService;

  public String getNewRefreshToken(TokenPayloadDto payloadDto) {
    return jwtService.generateRefreshToken(payloadDto);
  }

  @Transactional(readOnly = true)
  public RefreshResponseDto refresh(RefreshRequestDto refreshRequest) {
    String refreshToken = refreshRequest.refreshToken();
    TokenPayloadDto payload = jwtService.verifyRefreshToken(refreshToken);
    UserAccount account = accountDao.findOneByEmailAndAccountType(
      payload.email(), payload.accountType()).orElseThrow(() -> new UnauthorizedException());
    ApplicationUser user = account.getApplicationUser();
    String accessToken = jwtService.generateAccessToken(payload);
    return new RefreshResponseDto(
      accessToken,
      new UserInfoDto(user.getUsername(), account.getEmail(), account.getAccountType(),
        user.getGlobalRoles()));
  }
}

