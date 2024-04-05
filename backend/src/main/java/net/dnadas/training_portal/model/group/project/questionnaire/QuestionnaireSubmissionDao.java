package net.dnadas.training_portal.model.group.project.questionnaire;

import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionStatsInternalDto;
import net.dnadas.training_portal.model.auth.ApplicationUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
  Page<QuestionnaireSubmission> findAllByGroupIdAndProjectIdAndQuestionnaireIdAndUserAndNotMaxPoint(
    Long groupId, Long projectId, Long questionnaireId, ApplicationUser user, Pageable pageable);

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
  Page<QuestionnaireSubmission> findAllByGroupIdAndProjectIdAndQuestionnaireIdAndUser(
    Long groupId, Long projectId, Long questionnaireId, ApplicationUser user, Pageable pageable);

  @Query("SELECT qs FROM QuestionnaireSubmission qs " +
    "INNER JOIN qs.submittedQuestions sq ON qs.id = sq.questionnaireSubmission.id " +
    "INNER JOIN sq.submittedAnswers sa ON sa.submittedQuestion.id = sq.id " +
    "WHERE qs.questionnaire.project.userGroup.id = :groupId " +
    "AND qs.questionnaire.project.id = :projectId " +
    "AND qs.questionnaire.id = :questionnaireId " +
    "AND qs.id = :submissionId " +
    "AND qs.user = :user")
  Optional<QuestionnaireSubmission> findByGroupIdAndProjectIdAndQuestionnaireIdAndIdAndUserWithQuestions(
    Long groupId, Long projectId, Long questionnaireId, Long submissionId, ApplicationUser user);

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
      "(SELECT maxqs.id FROM QuestionnaireSubmission maxqs WHERE maxqs.questionnaire.id = q.id AND maxqs.status = :status AND maxqs.user.id = u.id ORDER BY maxqs.receivedPoints DESC, maxqs.createdAt DESC LIMIT 1), " +
      "(SELECT maxqs.createdAt FROM QuestionnaireSubmission maxqs WHERE maxqs.questionnaire.id = q.id AND maxqs.status = :status AND maxqs.user.id = u.id ORDER BY maxqs.receivedPoints DESC, maxqs.createdAt DESC LIMIT 1), " +
      "(SELECT maxqs.receivedPoints FROM QuestionnaireSubmission maxqs WHERE maxqs.questionnaire.id = q.id AND maxqs.status = :status AND maxqs.user.id = u.id ORDER BY maxqs.receivedPoints DESC, maxqs.createdAt DESC LIMIT 1), " +
      "(SELECT lastqs.id FROM QuestionnaireSubmission lastqs WHERE lastqs.questionnaire.id = q.id AND lastqs.status = :status AND lastqs.user.id = u.id ORDER BY lastqs.createdAt DESC  LIMIT 1), " +
      "(SELECT lastqs.createdAt FROM QuestionnaireSubmission lastqs WHERE lastqs.questionnaire.id = q.id AND lastqs.status = :status AND lastqs.user.id = u.id ORDER BY lastqs.createdAt DESC  LIMIT 1), " +
      "(SELECT lastqs.receivedPoints FROM QuestionnaireSubmission lastqs WHERE lastqs.questionnaire.id = q.id AND lastqs.status = :status AND lastqs.user.id = u.id ORDER BY lastqs.createdAt DESC  LIMIT 1), " +
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
      "q.name, q.maxPoints, " +
      "(SELECT maxqs.id FROM QuestionnaireSubmission maxqs WHERE maxqs.questionnaire.id = q.id AND maxqs.status = :status AND maxqs.user.id = u.id ORDER BY maxqs.receivedPoints DESC, maxqs.createdAt DESC LIMIT 1), " +
      "(SELECT maxqs.createdAt FROM QuestionnaireSubmission maxqs WHERE maxqs.questionnaire.id = q.id AND maxqs.status = :status AND maxqs.user.id = u.id ORDER BY maxqs.receivedPoints DESC, maxqs.createdAt DESC LIMIT 1), " +
      "(SELECT maxqs.receivedPoints FROM QuestionnaireSubmission maxqs WHERE maxqs.questionnaire.id = q.id AND maxqs.status = :status AND maxqs.user.id = u.id ORDER BY maxqs.receivedPoints DESC, maxqs.createdAt DESC LIMIT 1), " +
      "(SELECT lastqs.id FROM QuestionnaireSubmission lastqs WHERE lastqs.questionnaire.id = q.id AND lastqs.status = :status AND lastqs.user.id = u.id ORDER BY lastqs.createdAt DESC  LIMIT 1), " +
      "(SELECT lastqs.createdAt FROM QuestionnaireSubmission lastqs WHERE lastqs.questionnaire.id = q.id AND lastqs.status = :status AND lastqs.user.id = u.id ORDER BY lastqs.createdAt DESC  LIMIT 1), " +
      "(SELECT lastqs.receivedPoints FROM QuestionnaireSubmission lastqs WHERE lastqs.questionnaire.id = q.id AND lastqs.status = :status AND lastqs.user.id = u.id ORDER BY lastqs.createdAt DESC  LIMIT 1), " +
      "u.id, u.username) " +
      "FROM Project p " +
      "JOIN p.assignedMembers u " +
      "LEFT JOIN Questionnaire q ON q.id = :questionnaireId " +
      "WHERE p.id = :projectId " +
      "AND p.userGroup.id = :groupId " +
      "ORDER BY u.username ASC")
  List<QuestionnaireSubmissionStatsInternalDto> getQuestionnaireSubmissionStatisticsWithNonSubmittersByStatus(
    Long groupId, Long projectId, Long questionnaireId, QuestionnaireStatus status);
}
