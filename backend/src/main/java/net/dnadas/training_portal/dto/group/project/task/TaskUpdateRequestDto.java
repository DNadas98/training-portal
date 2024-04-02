package net.dnadas.training_portal.dto.group.project.task;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import net.dnadas.training_portal.model.group.project.task.Importance;
import net.dnadas.training_portal.model.group.project.task.TaskStatus;
import org.hibernate.validator.constraints.Length;

public record TaskUpdateRequestDto(
  @NotNull @Length(min = 1, max = 50) String name,
  @NotNull @Length(min = 1, max = 255) String description,
  @NotNull Importance importance,
  @NotNull @Min(1) @Max(5) Integer difficulty,
  @NotNull String startDate,
  @NotNull String deadline,
  @NotNull TaskStatus taskStatus) {
}
