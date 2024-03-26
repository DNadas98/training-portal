package com.codecool.training_portal.dto.group.project.questionnaire;

import java.util.List;

public record QuestionnaireSubmissionRequestDto(
  Long questionnaireId, List<SubmittedQuestionRequestDto> questions) {
}
