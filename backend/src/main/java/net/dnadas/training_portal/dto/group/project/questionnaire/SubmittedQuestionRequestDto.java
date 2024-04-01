package net.dnadas.training_portal.dto.group.project.questionnaire;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record SubmittedQuestionRequestDto(
  @NotNull Long questionId, @NotNull List<@Valid SubmittedAnswerRequestDto> checkedAnswers) {
}
