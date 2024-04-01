package net.dnadas.training_portal.dto.group.project.questionnaire;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record SubmittedAnswerRequestDto(@NotNull @Min(1) Long answerId) {
}
