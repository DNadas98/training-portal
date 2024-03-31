package com.codecool.training_portal.dto.group.project.questionnaire;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.util.Set;

public record QuestionnaireCreateRequestDto(
  @NotNull @Length(min = 1,max = 100) String name,
  @NotNull String description,
  @NotNull Set<@Valid QuestionCreateRequestDto> questions) {
}
