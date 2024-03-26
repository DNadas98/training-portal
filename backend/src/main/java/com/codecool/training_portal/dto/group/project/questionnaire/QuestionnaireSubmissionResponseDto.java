package com.codecool.training_portal.dto.group.project.questionnaire;

import java.util.List;

public record QuestionnaireSubmissionResponseDto(
  Long id, String name, String description, List<SubmittedQuestionResponseDto> questions,
  Integer receivedPoints, Integer maxPoints, String createdAt) {
}
