package net.dnadas.training_portal.model.group.project.questionnaire;

import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionStatsInternalDto;
import net.dnadas.training_portal.model.auth.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface QuestionnaireSubmissionDao extends JpaRepository<QuestionnaireSubmission, Long> {

  @Query(
    "SELECT qs FROM QuestionnaireSubmission qs " +
      "WHERE qs.questionnaire.project.userGroup.id = :groupId " +
      "AND qs.questionnaire.project.id = :projectId " +
      "AND qs.questionnaire.id = :questionnaireId " +
      "AND qs.user = :user " +
      "AND qs.maxPoints > qs.receivedPoints " +
      "ORDER BY qs.receivedPoints DESC")
  List<QuestionnaireSubmission> findAllByGroupIdAndProjectIdAndQuestionnaireIdAndUserAndNotMaxPoint(
    Long groupId, Long projectId, Long questionnaireId, ApplicationUser user);

  @Query("SELECT qs FROM QuestionnaireSubmission qs " +
    "WHERE qs.questionnaire.project.userGroup.id = :groupId " +
    "AND qs.questionnaire.project.id = :projectId " +
    "AND qs.questionnaire.id = :questionnaireId " +
    "AND qs.user = :user " +
    "AND qs.maxPoints = qs.receivedPoints")
  Optional<QuestionnaireSubmission> findByGroupIdAndProjectIdAndQuestionnaireIdAndUserAndMaxPoint(
    Long groupId, Long projectId, Long questionnaireId, ApplicationUser user);

  @Query("SELECT qs FROM QuestionnaireSubmission qs " +
    "WHERE qs.questionnaire.project.userGroup.id = :groupId " +
    "AND qs.questionnaire.project.id = :projectId " +
    "AND qs.questionnaire.id = :questionnaireId " +
    "AND qs.user = :user " +
    "ORDER BY qs.receivedPoints DESC, " +
    "qs.createdAt DESC")
  List<QuestionnaireSubmission> findAllByGroupIdAndProjectIdAndQuestionnaireIdAndUser(
    Long groupId, Long projectId, Long questionnaireId, ApplicationUser user);

  @Query("SELECT qs FROM QuestionnaireSubmission qs " +
    "WHERE qs.questionnaire.project.userGroup.id = :groupId " +
    "AND qs.questionnaire.project.id = :projectId " +
    "AND qs.questionnaire.id = :questionnaireId " +
    "AND qs.id = :submissionId " +
    "AND qs.user = :user")
  Optional<QuestionnaireSubmission> findByGroupIdAndProjectIdAndQuestionnaireIdAndIdAndUser(
    Long groupId, Long projectId, Long questionnaireId, Long submissionId, ApplicationUser user);


  @Query(
    "SELECT DISTINCT new net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionStatsInternalDto(" +
      "q.name, " +
      "qs.maxPoints, " +
      "(SELECT sqs.id FROM QuestionnaireSubmission sqs WHERE sqs.questionnaire.id = q.id AND sqs.status = :status AND sqs.user.id = u.id ORDER BY sqs.receivedPoints DESC, sqs.createdAt DESC LIMIT 1), " +
      "(SELECT sqs.createdAt FROM QuestionnaireSubmission sqs WHERE sqs.questionnaire.id = q.id AND sqs.status = :status AND sqs.user.id = u.id ORDER BY sqs.receivedPoints DESC, sqs.createdAt DESC LIMIT 1), " +
      "(SELECT sqs.receivedPoints FROM QuestionnaireSubmission sqs WHERE sqs.questionnaire.id = q.id AND sqs.status = :status AND sqs.user.id = u.id ORDER BY sqs.receivedPoints DESC, sqs.createdAt DESC LIMIT 1), " +
      "(SELECT lqs.id FROM QuestionnaireSubmission lqs WHERE lqs.questionnaire.id = q.id AND lqs.status = :status AND lqs.user.id = u.id ORDER BY lqs.createdAt DESC  LIMIT 1), " +
      "(SELECT lqs.createdAt FROM QuestionnaireSubmission lqs WHERE lqs.questionnaire.id = q.id AND lqs.status = :status AND lqs.user.id = u.id ORDER BY lqs.createdAt DESC  LIMIT 1), " +
      "(SELECT lqs.receivedPoints FROM QuestionnaireSubmission lqs WHERE lqs.questionnaire.id = q.id AND lqs.status = :status AND lqs.user.id = u.id ORDER BY lqs.createdAt DESC  LIMIT 1), " +
      "u.id, u.username) " +
      "FROM QuestionnaireSubmission qs " +
      "JOIN qs.questionnaire q " +
      "JOIN qs.user u " +
      "WHERE q.project.userGroup.id = :groupId " +
      "AND q.project.id = :projectId " +
      "AND q.id = :questionnaireId " +
      "ORDER BY u.username ASC")
  List<QuestionnaireSubmissionStatsInternalDto> getQuestionnaireSubmissionStatisticsByStatus(
    Long groupId, Long projectId, Long questionnaireId, QuestionnaireStatus status);

  @Query(
    "SELECT DISTINCT new net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionStatsInternalDto(" +
      "q.name, " +
      "qs.maxPoints, " +
      "(SELECT sqs.id FROM QuestionnaireSubmission sqs WHERE sqs.questionnaire.id = q.id AND sqs.status =  'ACTIVE' AND sqs.user.id = u.id ORDER BY sqs.receivedPoints DESC, sqs.createdAt DESC LIMIT 1), " +
      "(SELECT sqs.createdAt FROM QuestionnaireSubmission sqs WHERE sqs.questionnaire.id = q.id AND sqs.status = 'ACTIVE' AND sqs.user.id = u.id ORDER BY sqs.receivedPoints DESC, sqs.createdAt DESC LIMIT 1), " +
      "(SELECT sqs.receivedPoints FROM QuestionnaireSubmission sqs WHERE sqs.questionnaire.id = q.id AND sqs.status =  'ACTIVE' AND sqs.user.id = u.id ORDER BY sqs.receivedPoints DESC, sqs.createdAt DESC LIMIT 1), " +
      "(SELECT lqs.id FROM QuestionnaireSubmission lqs WHERE lqs.questionnaire.id = q.id AND lqs.status =  'ACTIVE' AND lqs.user.id = u.id ORDER BY lqs.createdAt DESC  LIMIT 1), " +
      "(SELECT lqs.createdAt FROM QuestionnaireSubmission lqs WHERE lqs.questionnaire.id = q.id AND lqs.status =  'ACTIVE' AND lqs.user.id = u.id ORDER BY lqs.createdAt DESC  LIMIT 1), " +
      "(SELECT lqs.receivedPoints FROM QuestionnaireSubmission lqs WHERE lqs.questionnaire.id = q.id AND lqs.status =  'ACTIVE' AND lqs.user.id = u.id ORDER BY lqs.createdAt DESC  LIMIT 1), " +
      "u.id, u.username) " +
      "FROM QuestionnaireSubmission qs " +
      "JOIN qs.questionnaire q " +
      "JOIN qs.user u " +
      "WHERE q.project.userGroup.id = :groupId " +
      "AND q.project.id = :projectId " +
      "AND q.id = :questionnaireId " +
      "AND u MEMBER OF q.project.assignedMembers " +
      "ORDER BY u.username ASC")
  List<QuestionnaireSubmissionStatsInternalDto> getActiveQuestionnaireSubmissionStatistics(
    Long groupId, Long projectId, Long questionnaireId);

  @Query(
    "SELECT am FROM Questionnaire q" +
      " JOIN q.project p" +
      " JOIN p.assignedMembers am " +
      "WHERE q.id = :questionnaireId " +
      "AND p.id = :projectId " +
      "AND p.userGroup.id = :groupId " +
      "AND NOT EXISTS (" +
      "SELECT qs FROM QuestionnaireSubmission qs " +
      "WHERE qs.user.id = am.id " +
      "AND qs.status = :status " +
      "AND qs.questionnaire.id = q.id) " +
      "ORDER BY am.username ASC"
  )
  List<ApplicationUser> findMembersWithoutSubmissionsForQuestionnaire(
    Long groupId, Long projectId, Long questionnaireId, QuestionnaireStatus status);
}
