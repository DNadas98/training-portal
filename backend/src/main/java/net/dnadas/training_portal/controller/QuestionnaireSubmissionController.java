package net.dnadas.training_portal.controller;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionRequestDto;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionResponseDto;
import net.dnadas.training_portal.service.group.project.questionnaire.QuestionnaireSubmissionService;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(
  "/api/v1/groups/{groupId}/projects/{projectId}/questionnaires/{questionnaireId}/submissions")
@RequiredArgsConstructor
public class QuestionnaireSubmissionController {
  private final QuestionnaireSubmissionService questionnaireSubmissionService;
  private final MessageSource messageSource;

  @GetMapping
  public ResponseEntity<?> getQuestionnaireSubmissions(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId) {
    List<QuestionnaireSubmissionResponseDto> submissions = questionnaireSubmissionService
      .getOwnQuestionnaireSubmissions(
        groupId, projectId, questionnaireId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", submissions));
  }

  @PostMapping
  public ResponseEntity<?> submitQuestionnaire(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId,
    @RequestBody QuestionnaireSubmissionRequestDto submissionRequest, Locale locale) {
    questionnaireSubmissionService.submitQuestionnaire(
      groupId, projectId, questionnaireId, submissionRequest);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of(
      "message",
      messageSource.getMessage("questionnaire.submitted.success", null, locale)));
  }

  @GetMapping("/{submissionId}")
  public ResponseEntity<?> getQuestionnaireSubmission(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId,
    @PathVariable Long submissionId) {
    QuestionnaireSubmissionResponseDto questionnaire = questionnaireSubmissionService
      .getOwnQuestionnaireSubmission(groupId, projectId, questionnaireId, submissionId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", questionnaire));
  }

  @GetMapping("/maxPoints")
  public ResponseEntity<?> getQuestionnaireSubmission(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId) {
    Optional<QuestionnaireSubmissionResponseDto> questionnaire = questionnaireSubmissionService
      .getMaxPointQuestionnaireSubmission(groupId, projectId, questionnaireId);
    if (questionnaire.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
        Map.of("message", "Max points submission not found"));
    }
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", questionnaire.get()));
  }
}
