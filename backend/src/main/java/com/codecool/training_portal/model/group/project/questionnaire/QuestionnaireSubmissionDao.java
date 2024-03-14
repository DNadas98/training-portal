package com.codecool.training_portal.model.group.project.questionnaire;

import com.codecool.training_portal.model.auth.ApplicationUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QuestionnaireSubmissionDao extends JpaRepository<QuestionnaireSubmission, Long> {

  @Query(
    "SELECT qs FROM QuestionnaireSubmission qs " +
      "WHERE qs.questionnaire.project.userGroup.id = :groupId " +
      "AND qs.questionnaire.project.id = :projectId " +
      "AND qs.questionnaire.id = :questionnaireId " +
      "AND qs.user = :user")
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
}
