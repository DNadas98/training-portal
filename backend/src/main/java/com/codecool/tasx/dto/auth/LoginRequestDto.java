package com.codecool.tasx.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record LoginRequestDto(
  @NotNull @Email String email,
  @NotNull @Length(min = 8, max = 50) String password) {
}
