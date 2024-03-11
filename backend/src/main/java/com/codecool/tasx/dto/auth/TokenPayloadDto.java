package com.codecool.tasx.dto.auth;

import com.codecool.tasx.model.auth.account.AccountType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

public record TokenPayloadDto(@NotNull @Email String email, @NotNull AccountType accountType) {
}
