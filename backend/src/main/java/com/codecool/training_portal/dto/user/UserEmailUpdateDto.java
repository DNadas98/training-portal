package com.codecool.training_portal.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record UserEmailUpdateDto(
  @NotNull @Email String email, @NotNull @Length(min = 8, max = 50) String password) {

  @Override
  public String toString() {
    return "UserEmailUpdateDto{" +
      "email='" + email + '\'' +
      '}';
  }
}
