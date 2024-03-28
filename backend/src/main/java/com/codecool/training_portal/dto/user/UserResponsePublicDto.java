package com.codecool.training_portal.dto.user;

import com.codecool.training_portal.model.auth.GlobalRole;
import com.codecool.training_portal.model.auth.PermissionType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.util.Set;

public record UserResponsePublicDto(
  @NotNull @Min(1) Long userId,
  @NotNull @Length(min = 1, max = 50) String username) {
}
