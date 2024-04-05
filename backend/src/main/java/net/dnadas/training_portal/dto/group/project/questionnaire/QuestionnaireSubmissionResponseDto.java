package net.dnadas.training_portal.dto.group.project.questionnaire;

public record QuestionnaireSubmissionResponseDto(
  Long id, String name, String description, Integer receivedPoints,
  Integer maxPoints, String createdAt) {
}
