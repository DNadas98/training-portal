package com.codecool.tasx.dto.company.project.task;

import com.codecool.tasx.model.company.project.task.Importance;
import com.codecool.tasx.model.company.project.task.TaskStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record TaskResponsePublicDto(
  @NotNull @Min(1) Long projectId,
  @NotNull @Min(1) Long taskId,
  @NotNull @Length(min = 1, max = 50) String name,
  @NotNull @Length(min = 1, max = 500) String description,
  @NotNull Importance importance,
  @NotNull @Min(1) @Max(5) Integer difficulty,
  @NotNull String startDate,
  @NotNull String deadline,
  @NotNull TaskStatus taskStatus) {
}
