package net.dnadas.training_portal.controller;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireResponseEditorDto;
import net.dnadas.training_portal.service.group.project.questionnaire.QuestionnaireService;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/groups/{groupId}/projects/{projectId}/coordinator/questionnaires")
@RequiredArgsConstructor
public class CoordinatorQuestionnaireController {
  private final QuestionnaireService questionnaireService;
  private final MessageSource messageSource;

  @GetMapping
  public ResponseEntity<?> getQuestionnaires(
    @PathVariable Long groupId, @PathVariable Long projectId) {
    List<QuestionnaireResponseEditorDto> questionnaires =
      questionnaireService.getCoordinatorQuestionnaires(
        groupId, projectId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", questionnaires));
  }

  @GetMapping("/{questionnaireId}")
  public ResponseEntity<?> getQuestionnaire(
    @PathVariable Long groupId, @PathVariable Long projectId, @PathVariable Long questionnaireId) {
    QuestionnaireResponseEditorDto questionnaire =
      questionnaireService.getCoordinatorQuestionnaire(
        groupId, projectId, questionnaireId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", questionnaire));
  }
}
