package com.codecool.training_portal.dto.group;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record GroupResponsePrivateDTO(
  @NotNull @Min(1) Long groupId,
  @NotNull String name,
  @NotNull String description,
  @NotNull String detailedDescription
) {
}
