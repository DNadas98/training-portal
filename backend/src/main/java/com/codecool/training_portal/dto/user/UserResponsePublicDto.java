package com.codecool.training_portal.dto.user;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record UserResponsePublicDto(
  @NotNull Long userId,
  @NotNull String username) {
}
