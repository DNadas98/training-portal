package com.codecool.training_portal.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UserAccountResponseDto(
  @NotNull @Min(1) Long id, @NotNull @Email String email) {
}
