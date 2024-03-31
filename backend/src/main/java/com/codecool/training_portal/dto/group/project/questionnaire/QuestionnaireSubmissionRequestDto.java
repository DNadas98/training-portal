package com.codecool.training_portal.dto.group.project.questionnaire;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record QuestionnaireSubmissionRequestDto(
  @NotNull @Min(1) Long questionnaireId, @NotNull List<@Valid SubmittedQuestionRequestDto> questions) {
}
