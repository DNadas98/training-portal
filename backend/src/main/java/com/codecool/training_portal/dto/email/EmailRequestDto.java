package com.codecool.training_portal.dto.email;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record EmailRequestDto(
  @NotNull @Email String to,
  @NotNull @Length(min = 1, max = 100) String subject,
  @NotNull @Length(min = 1, max = 1000) String content) {

  @Override
  public String toString() {
    return String.format("E-mail to: %s, Subject: %s", to, subject);
  }
}