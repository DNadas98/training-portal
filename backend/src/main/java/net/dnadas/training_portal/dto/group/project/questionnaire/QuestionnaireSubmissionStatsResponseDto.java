package net.dnadas.training_portal.dto.group.project.questionnaire;

/**
 * DTO for Questionnaire Statistics
 *
 * @param questionnaireName
 * @param questionnaireMaxPoints            NULLABLE
 * @param maxPointSubmissionId              NULLABLE
 * @param maxPointSubmissionCreatedAt       NULLABLE
 * @param maxPointSubmissionReceivedPoints  NULLABLE
 * @param userId
 * @param username
 * @param fullName
 * @param email
 * @param currentCoordinatorFullName
 * @param hasExternalTestQuestionnaire
 * @param hasExternalTestFailure
 * @param receivedSuccessfulCompletionEmail
 * @param submissionCount
 */
public record QuestionnaireSubmissionStatsResponseDto(
  String questionnaireName, Integer questionnaireMaxPoints, Long maxPointSubmissionId,
  String maxPointSubmissionCreatedAt,
  Integer maxPointSubmissionReceivedPoints,
  Long userId, String username, String fullName, String email,
  String currentCoordinatorFullName,
  Boolean hasExternalTestQuestionnaire,
  Boolean hasExternalTestFailure,
  Boolean receivedSuccessfulCompletionEmail, Long submissionCount) {
}
