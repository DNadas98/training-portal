package net.dnadas.training_portal.dto.group.project.questionnaire;

import net.dnadas.training_portal.dto.user.UserResponsePublicDto;
import net.dnadas.training_portal.model.group.project.questionnaire.QuestionnaireStatus;

import java.util.List;

public record QuestionnaireResponseEditorDetailsDto(
  Long id, String name, String description,
  QuestionnaireStatus status,
  Integer maxPoints,
  UserResponsePublicDto createdBy, String createdAt,
  UserResponsePublicDto updatedBy, String updatedAt,
  List<QuestionResponseEditorDto> questions) {
}
