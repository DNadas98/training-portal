package com.codecool.training_portal.dto.user;

import jakarta.validation.constraints.NotNull;

public record UserResponsePublicDto(
  @NotNull Long userId,
  @NotNull String username) {
}
