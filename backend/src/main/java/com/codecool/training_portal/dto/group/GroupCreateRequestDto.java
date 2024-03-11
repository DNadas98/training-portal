package com.codecool.training_portal.dto.group;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record GroupCreateRequestDto(
  @NotNull @Length(min = 1, max = 50) String name,
  @NotNull @Length(min = 1, max = 500) String description) {
}
