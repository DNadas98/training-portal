package net.dnadas.training_portal.dto.auth;

import jakarta.validation.constraints.NotNull;
import net.dnadas.training_portal.model.auth.GlobalRole;

import java.util.Set;

public record UserInfoDto(
  @NotNull String username,
  @NotNull String email,
  @NotNull String fullName,
  @NotNull Set<GlobalRole> roles) {
}
