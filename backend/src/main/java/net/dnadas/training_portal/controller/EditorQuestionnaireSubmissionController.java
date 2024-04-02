package net.dnadas.training_portal.controller;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionResponseEditorDto;
import net.dnadas.training_portal.service.group.project.questionnaire.QuestionnaireSubmissionService;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId,
    @RequestParam @Min(1) int page, @RequestParam @Min(1) @Max(50) int size) {
    Pageable pageable = PageRequest.of(page - 1, size);
    Page<QuestionnaireSubmissionResponseEditorDto> submissions = questionnaireSubmissionService
      .getOwnQuestionnaireSubmissionsAsEditor(
        groupId, projectId, questionnaireId, pageable);
    Map<String, Object> response = new HashMap<>();
    response.put("data", submissions.getContent());
    response.put("totalItems", submissions.getTotalElements());
    response.put("totalPages", submissions.getTotalPages());
    response.put("currentPage", submissions.getNumber() + 1);
    response.put("size", submissions.getSize());
    return ResponseEntity.status(HttpStatus.OK).body(response);
  }

  @DeleteMapping("/{submissionId}")
  public ResponseEntity<?> deleteQuestionnaireSubmission(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId,
    @PathVariable Long submissionId, Locale locale) {
    questionnaireSubmissionService
      .deleteQuestionnaireSubmissionAsEditor(groupId, projectId, questionnaireId, submissionId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of(
      "message",
      messageSource.getMessage("questionnaire.submission.deleted.success", null, locale)));
  }
}
