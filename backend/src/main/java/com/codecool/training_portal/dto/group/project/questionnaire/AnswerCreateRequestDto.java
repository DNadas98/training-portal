package com.codecool.training_portal.dto.group.project.questionnaire;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AnswerCreateRequestDto(@NotNull String text, @NotNull Boolean correct,
                                     @NotNull @Min(1) Integer order) {
}
