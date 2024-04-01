package com.codecool.training_portal.dto.auth;

import com.codecool.training_portal.model.auth.GlobalRole;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record UserInfoDto(
  @NotNull String username,
  @NotNull String email,
  @NotNull Set<GlobalRole> roles) {
}
