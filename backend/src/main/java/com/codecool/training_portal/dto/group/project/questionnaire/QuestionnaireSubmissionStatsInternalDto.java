package com.codecool.training_portal.dto.group.project.questionnaire;

import java.time.Instant;

public record QuestionnaireSubmissionStatsInternalDto(
  String questionnaireName, Integer questionnaireMaxPoints, Long maxPointSubmissionId,
  Instant maxPointSubmissionCreatedAt,
  Integer maxPointSubmissionReceivedPoints, Long lastSubmissionId, Instant lastSubmissionCreatedAt,
  Integer lastSubmissionReceivedPoints,
  Long userId, String username) {
}
