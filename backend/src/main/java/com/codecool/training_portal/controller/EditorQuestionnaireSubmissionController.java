package com.codecool.training_portal.controller;

import com.codecool.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionRequestDto;
import com.codecool.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionResponseDto;
import com.codecool.training_portal.service.group.project.questionnaire.QuestionnaireSubmissionService;
import lombok.RequiredArgsConstructor;
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
  "/api/v1/groups/{groupId}/projects/{projectId}/editor/questionnaires/{questionnaireId}/submissions")
@RequiredArgsConstructor
public class EditorQuestionnaireSubmissionController {
  private final QuestionnaireSubmissionService questionnaireSubmissionService;

  @GetMapping
  public ResponseEntity<?> getAllQuestionnaireSubmissions(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId) {
    List<QuestionnaireSubmissionResponseDto> submissions = questionnaireSubmissionService
      .getOwnQuestionnaireSubmissionsAsEditor(
        groupId, projectId, questionnaireId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", submissions));
  }
}
