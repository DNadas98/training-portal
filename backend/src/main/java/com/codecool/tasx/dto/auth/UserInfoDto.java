package com.codecool.tasx.dto.auth;

import com.codecool.tasx.model.auth.account.AccountType;
import com.codecool.tasx.model.user.GlobalRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.util.Set;

public record UserInfoDto(
  @NotNull @Length(min = 1, max = 50) String username,
  @NotNull @Email String email,
  @NotNull AccountType accountType,
  @NotNull Set<GlobalRole> roles) {
}
