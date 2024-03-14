package com.codecool.training_portal.dto.group.project.questionnaire;

import com.codecool.training_portal.dto.user.UserResponsePublicDto;
import com.codecool.training_portal.model.group.project.questionnaire.QuestionnaireStatus;

import java.util.List;

public record QuestionnaireResponseEditorDetailsDto(
  Long id, String name, String description,
  QuestionnaireStatus status,
  UserResponsePublicDto createdBy, String createdAt,
  UserResponsePublicDto updatedBy, String updatedAt,
  List<QuestionResponseEditorDto> questions) {
}
