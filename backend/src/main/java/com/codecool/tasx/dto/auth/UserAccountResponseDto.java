package com.codecool.tasx.dto.auth;

import com.codecool.tasx.model.auth.account.AccountType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UserAccountResponseDto(
  @NotNull @Min(1) Long id, @NotNull @Email String email,
  @NotNull AccountType accountType) {
}
