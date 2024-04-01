package com.codecool.training_portal.dto.user;

import com.codecool.training_portal.model.auth.PermissionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record UserResponseWithPermissionsDto(
  @NotNull @Min(1) Long userId,
  @NotNull String username,
  @NotNull List<PermissionType> permissions) {
}
