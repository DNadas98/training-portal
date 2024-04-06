package net.dnadas.training_portal.controller;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionStatsAdminDto;
import net.dnadas.training_portal.model.group.project.questionnaire.QuestionnaireStatus;
import net.dnadas.training_portal.service.group.project.questionnaire.QuestionnaireSubmissionService;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
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
    @RequestParam QuestionnaireStatus status, @RequestParam @Min(1) int page,
    @RequestParam @Min(1) @Max(50) int size, @RequestParam(required = false) String search) {
    String decodedSearch = URLDecoder.decode(search, StandardCharsets.UTF_8);
    //TODO: sanitize search input
    Page<QuestionnaireSubmissionStatsAdminDto> statistics =
      questionnaireSubmissionService.getQuestionnaireSubmissionStatistics(
        groupId, projectId, questionnaireId, status, PageRequest.of(page - 1, size), decodedSearch);
    Map<String, Object> response = new HashMap<>();
    response.put("data", statistics.getContent());
    response.put("totalPages", statistics.getTotalPages());
    response.put("currentPage", statistics.getNumber() + 1);
    response.put("totalItems", statistics.getTotalElements());
    response.put("size", statistics.getSize());
    return ResponseEntity.status(HttpStatus.OK).body(response);
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
