package com.codecool.training_portal.model.group.project.questionnaire;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface QuestionnaireDao extends JpaRepository<Questionnaire, Long> {

  @Query("SELECT q FROM Questionnaire q " +
    "WHERE q.project.userGroup.id = :groupId " +
    "AND q.project.id = :projectId " +
    "AND q.id = :id")
  Optional<Questionnaire> findByGroupIdAndProjectIdAndId(Long groupId, Long projectId, Long id);

  @Query("SELECT q FROM Questionnaire q " +
    "WHERE q.project.userGroup.id = :groupId " +
    "AND q.project.id = :projectId")
  List<Questionnaire> findAllByGroupIdAndProjectId(Long groupId, Long projectId);
}
