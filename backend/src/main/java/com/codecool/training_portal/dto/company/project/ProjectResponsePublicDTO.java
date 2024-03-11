package com.codecool.training_portal.dto.company.project;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record ProjectResponsePublicDTO(
  @NotNull @Min(1) Long companyId,
  @NotNull @Min(1) Long projectId,
  @NotNull @Length(min = 1, max = 50) String name,
  @NotNull @Length(min = 1, max = 500) String description) {
}
