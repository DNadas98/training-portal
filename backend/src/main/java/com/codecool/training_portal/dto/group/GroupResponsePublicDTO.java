package com.codecool.training_portal.dto.group;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record GroupResponsePublicDTO(
        @NotNull @Min(1) Long groupId,
  @NotNull @Length(min = 1, max = 50) String name,
  @NotNull @Length(min = 1, max = 255) String description) {
}
