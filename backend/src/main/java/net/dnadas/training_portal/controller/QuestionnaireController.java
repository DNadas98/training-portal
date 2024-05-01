package net.dnadas.training_portal.controller;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireResponseDetailsDto;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireResponseDto;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireResponseEditorDto;
import net.dnadas.training_portal.service.group.project.questionnaire.QuestionnaireService;
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

  @GetMapping("/all")
  public ResponseEntity<?> getAllQuestionnaires(
    @PathVariable Long groupId, @PathVariable Long projectId) {
    List<QuestionnaireResponseEditorDto> questionnaires = questionnaireService.getQuestionnairesOfProject(
      groupId, projectId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", questionnaires));
  }

  @GetMapping
  public ResponseEntity<?> getQuestionnaires(
    @PathVariable Long groupId, @PathVariable Long projectId,
    @RequestParam(required = false) Boolean maxPoints) {
    List<QuestionnaireResponseDto> questionnaires = questionnaireService.getActiveQuestionnaires(
      groupId, projectId, maxPoints);
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
