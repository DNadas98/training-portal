package net.dnadas.training_portal.dto.group.project.questionnaire;

/**
 * DTO for Questionnaire Statistics
 *
 * @param questionnaireName
 * @param questionnaireMaxPoints
 * @param maxPointSubmissionId             NULLABLE!
 * @param maxPointSubmissionCreatedAt      NULLABLE!
 * @param maxPointSubmissionReceivedPoints NULLABLE!
 * @param lastSubmissionId                 NULLABLE!
 * @param lastSubmissionCreatedAt          NULLABLE!
 * @param lastSubmissionReceivedPoints     NULLABLE!
 * @param userId
 * @param username
 */
public record QuestionnaireSubmissionStatsAdminDto(
  String questionnaireName, Integer questionnaireMaxPoints, Long maxPointSubmissionId,
  String maxPointSubmissionCreatedAt,
  Integer maxPointSubmissionReceivedPoints, Long lastSubmissionId, String lastSubmissionCreatedAt,
  Integer lastSubmissionReceivedPoints,
  Long userId, String username, Long submissionCount) {
}
