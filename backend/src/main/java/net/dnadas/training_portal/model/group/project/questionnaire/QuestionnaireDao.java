package net.dnadas.training_portal.model.group.project.questionnaire;

import net.dnadas.training_portal.model.auth.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface QuestionnaireDao extends JpaRepository<Questionnaire, Long> {

  @Query("SELECT q FROM Questionnaire q " +
    "INNER JOIN FETCH q.questions " +
    "WHERE q.project.userGroup.id = :groupId " +
    "AND q.project.id = :projectId " +
    "AND q.id = :id " +
    "AND q.status = 'ACTIVE'")
  Optional<Questionnaire> findByGroupIdAndProjectIdAndIdAndActiveStatusWithQuestions(
    Long groupId, Long projectId, Long id);

  @Query("SELECT q FROM Questionnaire q " +
    "INNER JOIN FETCH q.questions " +
    "WHERE q.project.userGroup.id = :groupId " +
    "AND q.project.id = :projectId " +
    "AND q.id = :id")
  Optional<Questionnaire> findByGroupIdAndProjectIdAndIdWithQuestions(
    Long groupId, Long projectId, Long id);

  @Query("SELECT q FROM Questionnaire q " +
    "WHERE q.project.userGroup.id = :groupId " +
    "AND q.project.id = :projectId " +
    "AND q.id = :id")
  Optional<Questionnaire> findByGroupIdAndProjectIdAndId(Long groupId, Long projectId, Long id);

  @Query("SELECT q FROM Questionnaire q " +
    "WHERE q.project.userGroup.id = :groupId " +
    "AND q.project.id = :projectId " +
    "AND q.status = 'ACTIVE' " +
    "AND NOT EXISTS (SELECT qs FROM QuestionnaireSubmission qs " +
    "WHERE qs.questionnaire = q " +
    "AND qs.user = :user " +
    "AND qs.maxPoints = qs.receivedPoints) " +
    "ORDER BY q.createdAt DESC")
  List<Questionnaire> findAllByGroupIdAndProjectIdAndActiveStatusAndNoMaxPointSubmission(
    Long groupId, Long projectId, ApplicationUser user);

  @Query("SELECT q FROM Questionnaire q " +
    "JOIN QuestionnaireSubmission qs " +
    "ON qs.questionnaire = q " +
    "WHERE q.project.userGroup.id = :groupId " +
    "AND q.project.id = :projectId " +
    "AND qs.user = :user " +
    "AND qs.maxPoints = qs.receivedPoints " +
    "ORDER BY qs.createdAt DESC")
  List<Questionnaire> findAllByGroupIdAndProjectIdAndMaxPointSubmissionExists(
    Long groupId, Long projectId, ApplicationUser user);

  @Query("SELECT q FROM Questionnaire q " +
    "WHERE q.project.userGroup.id = :groupId " +
    "AND q.project.id = :projectId " +
    "ORDER BY q.createdAt DESC")
  List<Questionnaire> findAllByGroupIdAndProjectId(Long groupId, Long projectId);
}
