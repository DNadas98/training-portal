package com.codecool.training_portal.dto.group.project.questionnaire;

import com.codecool.training_portal.model.group.project.questionnaire.QuestionnaireStatus;

import java.util.List;

public record QuestionnaireSubmissionResponseEditorDto(
  Long id, String name, String description, List<SubmittedQuestionResponseDto> questions,
  Integer receivedPoints, Integer maxPoints, String createdAt, QuestionnaireStatus status) {
}
