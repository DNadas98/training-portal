package net.dnadas.training_portal.dto.group.project.questionnaire;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record AnswerCreateRequestDto(
  @NotNull @Length(min = 1, max = 500) String text,
  @NotNull Boolean correct,
  @NotNull @Min(1) Integer order) {
}
