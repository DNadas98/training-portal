package net.dnadas.training_portal.dto.group.project.questionnaire;

import java.time.Instant;

public record QuestionnaireSubmissionStatsInternalDto(
  String questionnaireName, Integer questionnaireMaxPoints, Long maxPointSubmissionId,
  Instant maxPointSubmissionCreatedAt,
  Integer maxPointSubmissionReceivedPoints,
  Long userId, String username, String fullName, String email,
  String currentCoordinatorFullName,
  String currentDataPreparatorFullName,
  Boolean hasExternalTestQuestionnaire,
  Boolean hasExternalTestFailure,
  Boolean receivedSuccessfulCompletionEmail,
  Long submissionCount) {
}
