package com.codecool.training_portal.dto.verification;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.util.UUID;

public record VerificationTokenDto(
  @NotNull @Min(1) Long id,
  @NotNull @Length(min = 1, max = 100) UUID verificationCode) {
}
