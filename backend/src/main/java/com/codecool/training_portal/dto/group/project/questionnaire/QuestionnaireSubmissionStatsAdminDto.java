package com.codecool.training_portal.dto.group.project.questionnaire;

public record QuestionnaireSubmissionStatsAdminDto(
  String questionnaireName, Integer questionnaireMaxPoints, Long maxPointSubmissionId, String maxPointSubmissionCreatedAt,
  Integer maxPointSubmissionReceivedPoints, Long lastSubmissionId, String lastSubmissionCreatedAt, Integer lastSubmissionReceivedPoints,
  Long userId, String username) {
}
