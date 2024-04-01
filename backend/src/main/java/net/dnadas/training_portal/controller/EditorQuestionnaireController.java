package net.dnadas.training_portal.controller;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireCreateRequestDto;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireResponseEditorDetailsDto;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireResponseEditorDto;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireUpdateRequestDto;
import net.dnadas.training_portal.service.group.project.questionnaire.QuestionnaireService;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/groups/{groupId}/projects/{projectId}/editor/questionnaires")
@RequiredArgsConstructor
public class EditorQuestionnaireController {
  private final QuestionnaireService questionnaireService;
  private final MessageSource messageSource;

  @GetMapping
  public ResponseEntity<?> getQuestionnaires(
    @PathVariable Long groupId, @PathVariable Long projectId) {
    List<QuestionnaireResponseEditorDto> questionnaires =
      questionnaireService.getEditorQuestionnaires(
        groupId, projectId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", questionnaires));
  }

  @GetMapping("/{questionnaireId}")
  public ResponseEntity<?> getQuestionnaire(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId) {
    QuestionnaireResponseEditorDetailsDto questionnaire =
      questionnaireService.getEditorQuestionnaire(
        groupId, projectId, questionnaireId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", questionnaire));
  }

  @PostMapping
  public ResponseEntity<?> createQuestionnaire(
    @PathVariable Long groupId, @PathVariable Long projectId,
    @RequestBody QuestionnaireCreateRequestDto questionnaireCreateRequestDto) {
    QuestionnaireResponseEditorDetailsDto questionnaire = questionnaireService.createQuestionnaire(
      groupId, projectId, questionnaireCreateRequestDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("data", questionnaire));
  }

  @PutMapping("/{questionnaireId}")
  public ResponseEntity<?> updateQuestionnaire(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId,
    @RequestBody QuestionnaireUpdateRequestDto QuestionnaireUpdateRequestDto) {
    QuestionnaireResponseEditorDetailsDto questionnaire = questionnaireService.updateQuestionnaire(
      groupId, projectId, questionnaireId, QuestionnaireUpdateRequestDto);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", questionnaire));
  }

  @DeleteMapping("/{questionnaireId}")
  public ResponseEntity<?> deleteQuestionnaire(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId,
    Locale locale) {
    questionnaireService.deleteQuestionnaire(groupId, projectId, questionnaireId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of(
      "message",
      messageSource.getMessage("questionnaire.deleted.success", null, locale)));
  }
}
