package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.group.project.questionnaire.QuestionnaireCreateRequestDto;
import com.codecool.training_portal.dto.group.project.questionnaire.QuestionnaireResponseEditorDto;
import com.codecool.training_portal.service.group.project.questionnaire.QuestionnaireService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/groups/{groupId}/projects/{projectId}/questionnaires")
@RequiredArgsConstructor
public class QuestionnaireController {
  private final QuestionnaireService questionnaireService;
  private final MessageSource messageSource;

  @GetMapping
  public ResponseEntity<?> getQuestionnaires(
    @PathVariable Long groupId, @PathVariable Long projectId) {
    List<QuestionnaireResponseEditorDto> questionnaires = questionnaireService.getQuestionnaires(
      groupId, projectId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", questionnaires));
  }

  @PostMapping
  public ResponseEntity<?> createQuestionnaire(
    @PathVariable Long groupId, @PathVariable Long projectId,
    @RequestBody QuestionnaireCreateRequestDto questionnaireCreateRequestDto) {
    QuestionnaireResponseEditorDto questionnaire = questionnaireService.createQuestionnaire(
      groupId, projectId, questionnaireCreateRequestDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("data", questionnaire));
  }

  @DeleteMapping("/{questionnaireId}")
  public ResponseEntity<?> deleteQuestionnaire(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId, Locale locale) {
    questionnaireService.deleteQuestionnaire(groupId, projectId, questionnaireId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("message",
      messageSource.getMessage("questionnaire.deleted.success", null, locale)));
  }
}
