package net.dnadas.training_portal.dto.user;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record UserDetailsUpdateDto(
  @NotNull @Length(min = 1, max = 50) String username,
  @NotNull @Length(min = 8, max = 50) String oldPassword,
  @Length(min = 8, max = 50) String newPassword) {

  @Override
  public String toString() {
    return "UserDetailsUpdateDto{" +
      "username='" + username + '\'' +
      '}';
  }
}
