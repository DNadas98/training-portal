package net.dnadas.training_portal.dto.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record RefreshResponseDto(
  @NotNull @Length(min = 1) String accessToken,
  @NotNull @Valid UserInfoDto userInfo) {
  @Override
  public String toString() {
    return "RefreshResponseDto{" +
      "userInfo=" + userInfo +
      '}';
  }
}
