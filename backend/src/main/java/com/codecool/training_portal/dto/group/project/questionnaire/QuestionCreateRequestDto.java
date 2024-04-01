package com.codecool.training_portal.dto.group.project.questionnaire;

import com.codecool.training_portal.model.group.project.questionnaire.QuestionType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record QuestionCreateRequestDto(
  @NotNull String text, @NotNull QuestionType type, @NotNull @Min(1) Integer order,
  @NotNull @Min(1) Integer points,
  Set<@Valid AnswerCreateRequestDto> answers) {
}
