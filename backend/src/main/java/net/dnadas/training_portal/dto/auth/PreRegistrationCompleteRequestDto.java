package net.dnadas.training_portal.dto.auth;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record PreRegistrationCompleteRequestDto(
  @NotNull @Length(min = 8, max = 50) String password) {
  @Override
  public String toString() {
    return "PreRegistrationCompleteRequestDto{}";
  }
}
