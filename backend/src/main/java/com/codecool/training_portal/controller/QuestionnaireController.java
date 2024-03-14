package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.group.project.questionnaire.QuestionnaireResponseDetailsDto;
import com.codecool.training_portal.dto.group.project.questionnaire.QuestionnaireResponseDto;
import com.codecool.training_portal.service.group.project.questionnaire.QuestionnaireService;
import com.codecool.training_portal.service.group.project.questionnaire.QuestionnaireSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/groups/{groupId}/projects/{projectId}/questionnaires")
@RequiredArgsConstructor
public class QuestionnaireController {
  private final QuestionnaireService questionnaireService;
  private final QuestionnaireSubmissionService questionnaireSubmissionService;
  private final MessageSource messageSource;

  @GetMapping
  public ResponseEntity<?> getQuestionnaires(
    @PathVariable Long groupId, @PathVariable Long projectId) {
    List<QuestionnaireResponseDto> questionnaires = questionnaireService.getQuestionnaires(
      groupId, projectId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", questionnaires));
  }

  @GetMapping("/{questionnaireId}")
  public ResponseEntity<?> getQuestionnaire(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId) {
    QuestionnaireResponseDetailsDto questionnaire = questionnaireService.getQuestionnaire(
      groupId, projectId, questionnaireId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", questionnaire));
  }
}
