package com.codecool.training_portal.dto.user;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record UserUsernameUpdateDto(
  @NotNull @Length(min = 1, max = 50) String username,
  @NotNull @Length(min = 8, max = 50) String password) {
}
