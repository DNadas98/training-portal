package net.dnadas.training_portal.controller;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionStatsAdminDto;
import net.dnadas.training_portal.model.group.project.questionnaire.QuestionnaireStatus;
import net.dnadas.training_portal.service.group.project.questionnaire.QuestionnaireSubmissionService;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping(
  "/api/v1/groups/{groupId}/projects/{projectId}/admin/questionnaires/{questionnaireId}/submissions")
@RequiredArgsConstructor
public class AdminQuestionnaireSubmissionController {
  private final QuestionnaireSubmissionService questionnaireSubmissionService;
  private final MessageSource messageSource;

  @GetMapping("/stats")
  public ResponseEntity<?> getAllQuestionnaireSubmissions(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId,
    @RequestParam QuestionnaireStatus status) {
    List<QuestionnaireSubmissionStatsAdminDto> statistics =
      questionnaireSubmissionService.getQuestionnaireSubmissionStatistics(
        groupId, projectId, questionnaireId, status);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", statistics));
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
