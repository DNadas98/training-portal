package com.codecool.tasx.dto.user;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record UserUsernameUpdateDto(
  @NotNull @Length(min = 1, max = 50) String username
) {
}
