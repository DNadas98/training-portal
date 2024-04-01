package net.dnadas.training_portal.dto.group.project;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import net.dnadas.training_portal.dto.group.project.task.TaskResponsePublicDto;
import org.hibernate.validator.constraints.Length;

import java.util.List;

public record ProjectResponsePrivateDTO(
  @NotNull @Min(1) Long groupId,
  @NotNull @Min(1) Long projectId,
  @NotNull @Length(min = 1, max = 50) String name,
  @NotNull @Length(min = 1, max = 255) String description,
  @NotNull @Length(min = 1, max = 10000) String detailedDescription,
  @NotNull String startDate,
  @NotNull String deadline,
  @NotNull List<@Valid TaskResponsePublicDto> tasks) {
}
