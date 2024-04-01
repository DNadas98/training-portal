package net.dnadas.training_portal.dto.group.project.questionnaire;

import net.dnadas.training_portal.dto.user.UserResponsePublicDto;
import net.dnadas.training_portal.model.group.project.questionnaire.QuestionnaireStatus;

public record QuestionnaireResponseEditorDto(
  Long id, String name, String description,
  QuestionnaireStatus status,
  Integer maxPoints,
  UserResponsePublicDto createdBy, String createdAt,
  UserResponsePublicDto updatedBy, String updatedAt) {
}
