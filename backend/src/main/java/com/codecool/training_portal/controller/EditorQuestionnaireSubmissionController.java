package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionResponseEditorDto;
import com.codecool.training_portal.service.group.project.questionnaire.QuestionnaireSubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping(
  "/api/v1/groups/{groupId}/projects/{projectId}/editor/questionnaires/{questionnaireId}/submissions")
@RequiredArgsConstructor
public class EditorQuestionnaireSubmissionController {
  private final QuestionnaireSubmissionService questionnaireSubmissionService;
  private final MessageSource messageSource;

  @GetMapping
  public ResponseEntity<?> getAllQuestionnaireSubmissions(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId) {
    List<QuestionnaireSubmissionResponseEditorDto> submissions = questionnaireSubmissionService
      .getOwnQuestionnaireSubmissionsAsEditor(
        groupId, projectId, questionnaireId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", submissions));
  }

  @DeleteMapping("/{submissionId}")
  public ResponseEntity<?> deleteQuestionnaireSubmission(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId,
    @PathVariable Long submissionId, Locale locale) {
    questionnaireSubmissionService
      .deleteQuestionnaireSubmission(groupId, projectId, questionnaireId, submissionId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of(
      "message",
      messageSource.getMessage("questionnaire.submission.deleted.success", null, locale)));
  }
}
