package com.codecool.training_portal.dto.user;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record UserResponsePrivateDto(
  @NotNull @Min(1) Long userId,
  @NotNull String username) {
}
