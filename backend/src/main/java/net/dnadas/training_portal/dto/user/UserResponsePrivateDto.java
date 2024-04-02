package net.dnadas.training_portal.dto.user;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UserResponsePrivateDto(
  @NotNull @Min(1) Long userId,
  @NotNull String username) {
}
