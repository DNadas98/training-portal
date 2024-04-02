package net.dnadas.training_portal.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record PasswordResetRequestDto(
  @NotNull @Email String email) {
}
