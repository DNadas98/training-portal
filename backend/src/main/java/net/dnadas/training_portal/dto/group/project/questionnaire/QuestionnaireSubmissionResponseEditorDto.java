package net.dnadas.training_portal.dto.group.project.questionnaire;

import net.dnadas.training_portal.model.group.project.questionnaire.QuestionnaireStatus;

public record QuestionnaireSubmissionResponseEditorDto(
  Long id, String name, String description, Integer receivedPoints, Integer maxPoints,
  String createdAt, QuestionnaireStatus status) {
}
