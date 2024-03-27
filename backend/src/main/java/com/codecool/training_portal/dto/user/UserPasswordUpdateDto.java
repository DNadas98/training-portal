package com.codecool.training_portal.dto.user;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record UserPasswordUpdateDto(
  @NotNull @Length(min = 8, max = 50) String password,
  @NotNull @Length(min = 8, max = 50) String newPassword) {
}
