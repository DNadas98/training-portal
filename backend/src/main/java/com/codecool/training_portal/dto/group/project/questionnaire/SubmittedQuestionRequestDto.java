package com.codecool.training_portal.dto.group.project.questionnaire;

import java.util.List;

public record SubmittedQuestionRequestDto(
  Long questionId, List<SubmittedAnswerRequestDto> checkedAnswers) {
}
