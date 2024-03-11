package com.codecool.training_portal.dto.user;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record UserResponsePublicDto(
  @NotNull @Min(1) Long userId,
  @NotNull @Length(min = 1, max = 50) String username) {
}
