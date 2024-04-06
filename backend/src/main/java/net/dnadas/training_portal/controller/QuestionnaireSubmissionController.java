package net.dnadas.training_portal.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionRequestDto;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionResponseDetailsDto;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionResponseDto;
import net.dnadas.training_portal.service.group.project.questionnaire.QuestionnaireSubmissionService;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId,
    @RequestParam @Min(1) int page, @RequestParam @Min(1) @Max(50) int size) {
    Pageable pageable = PageRequest.of(page - 1, size);
    Page<QuestionnaireSubmissionResponseDto> submissions = questionnaireSubmissionService
      .getOwnQuestionnaireSubmissions(groupId, projectId, questionnaireId, pageable);
    Map<String, Object> response = new HashMap<>();
    response.put("data", submissions.getContent());
    response.put("totalPages", submissions.getTotalPages());
    response.put("currentPage", submissions.getNumber() + 1);
    response.put("totalItems", submissions.getTotalElements());
    response.put("size", submissions.getSize());
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @PostMapping
  public ResponseEntity<?> submitQuestionnaire(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId,
    @RequestBody @Valid QuestionnaireSubmissionRequestDto submissionRequest, Locale locale) {
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
    QuestionnaireSubmissionResponseDetailsDto submission = questionnaireSubmissionService
      .getOwnQuestionnaireSubmission(groupId, projectId, questionnaireId, submissionId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", submission));
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
