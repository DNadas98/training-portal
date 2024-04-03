package net.dnadas.training_portal.dto.group.project.questionnaire;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import net.dnadas.training_portal.model.group.project.questionnaire.QuestionType;
import org.hibernate.validator.constraints.Length;

import java.util.Set;

public record QuestionCreateRequestDto(
  @NotNull @Length(min = 1, max = 3000) String text,
  @NotNull QuestionType type,
  @NotNull @Min(1) Integer order,
  @NotNull @Min(1) Integer points,
  Set<@Valid AnswerCreateRequestDto> answers) {
}
