package net.dnadas.training_portal.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.GroupCreateRequestDto;
import net.dnadas.training_portal.dto.group.GroupResponsePrivateDTO;
import net.dnadas.training_portal.dto.group.GroupResponsePublicDTO;
import net.dnadas.training_portal.dto.group.project.ProjectResponsePublicDTO;
import net.dnadas.training_portal.dto.group.project.questionnaire.QuestionnaireResponseEditorDto;
import net.dnadas.training_portal.service.group.GroupAdminService;
import net.dnadas.training_portal.service.group.GroupService;
import net.dnadas.training_portal.service.group.project.ProjectService;
import net.dnadas.training_portal.service.group.project.questionnaire.QuestionnaireService;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@Controller
@RequestMapping("/api/v1/admin/groups")
@RequiredArgsConstructor
public class GlobalAdminGroupController {
  private final GroupService groupService;
  private final ProjectService projectService;
  private final QuestionnaireService questionnaireService;
  private final GroupAdminService groupAdminService;
  private final MessageSource messageSource;

  @GetMapping
  public ResponseEntity<?> getAllGroups() {
    List<GroupResponsePublicDTO> groups = groupService.getAllGroups();
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", groups));
  }

  @GetMapping("/{groupId}/projects")
  public ResponseEntity<?> getAllProjectOfGroup(@PathVariable @Min(1) Long groupId) {
    List<ProjectResponsePublicDTO> projects = projectService.getAllProjectsOfGroup(groupId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", projects));
  }

  @GetMapping("/{groupId}/projects/{projectId}/questionnaires")
  public ResponseEntity<?> getQuestionnairesOfProject(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long projectId) {
    List<QuestionnaireResponseEditorDto> questionnaires =
      questionnaireService.getQuestionnairesOfProject(groupId, projectId);
    return ResponseEntity.status(HttpStatus.OK).body(Map.of("data", questionnaires));
  }

  @PostMapping
  public ResponseEntity<?> createGroup(
    @RequestBody @Valid GroupCreateRequestDto createRequestDto, Locale locale) {
    GroupResponsePrivateDTO groupResponseDetails = groupService.createGroup(
      createRequestDto);
    return ResponseEntity.status(HttpStatus.CREATED).body(
      Map.of("message",
        messageSource.getMessage("group.create.success", null, locale),
        "data", groupResponseDetails));
  }

  @DeleteMapping("/{groupId}/admins/{userId}")
  public ResponseEntity<?> removeAdmin(
    @PathVariable @Min(1) Long groupId, @PathVariable @Min(1) Long userId, Locale locale) {
    groupAdminService.removeAdmin(groupId, userId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("group.admins.remove.success", null, locale)));
  }

  @DeleteMapping("/{groupId}")
  public ResponseEntity<?> deleteGroup(@PathVariable @Min(1) Long groupId, Locale locale) {
    groupService.deleteGroup(groupId);
    return ResponseEntity.status(HttpStatus.OK).body(
      Map.of(
        "message",
        messageSource.getMessage("group.delete.success", null, locale)));
  }
}
