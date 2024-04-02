package net.dnadas.training_portal.dto.group.project;

import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record ProjectCreateRequestDto(
  @NotNull @Length(min = 1, max = 50) String name,
  @NotNull @Length(min = 1, max = 255) String description,
  @NotNull @Length(min = 1, max = 10000) String detailedDescription,
  @NotNull String startDate,
  @NotNull String deadline) {
}
