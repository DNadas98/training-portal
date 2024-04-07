package net.dnadas.training_portal.dto.user;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UserResponseWithProjectAndGroupPermissionsInternalDto(
  @NotNull @Min(1) Long userId,
  @NotNull String username,
  Boolean isAdmin,
  Boolean isCoordinator,
  Boolean isEditor,
  Boolean isGroupAdmin,
  Boolean isGroupEditor) {
}
