package com.codecool.training_portal.dto.auth;

import com.codecool.training_portal.model.auth.GlobalRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.util.Set;

public record UserInfoDto(
  @NotNull @Length(min = 1, max = 50) String username,
  @NotNull @Email String email,
  @NotNull Set<GlobalRole> roles) {
}
