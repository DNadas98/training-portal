package net.dnadas.training_portal.dto.user;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record UserFullNameUpdateDto(
  @NotNull @Length(min = 1, max = 100) String fullName,
  @NotNull @Length(min = 8, max = 50) String password) {

  @Override
  public String toString() {
    return "UserFullNameUpdateDto{" +
      "username='" + fullName + '\'' +
      '}';
  }
}
