package com.codecool.training_portal.dto.group.project.questionnaire;

import com.codecool.training_portal.model.group.project.questionnaire.QuestionnaireStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

import java.util.Set;

public record QuestionnaireUpdateRequestDto(
  @NotNull @Length(min = 1, max = 100) String name, @NotNull String description,
  @NotNull QuestionnaireStatus status,
  @NotNull Set<@Valid QuestionCreateRequestDto> questions) {
}
