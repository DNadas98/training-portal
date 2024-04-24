package net.dnadas.training_portal.dto.user;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import net.dnadas.training_portal.model.auth.PermissionType;

import java.util.List;

public record UserResponseWithPermissionsDto(
  @NotNull @Min(1) Long userId,
  @NotNull String username,
  @NotNull String fullName,
  @NotNull List<PermissionType> permissions) {
}
