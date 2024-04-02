package net.dnadas.training_portal.dto.group.project.questionnaire;

import net.dnadas.training_portal.model.group.project.questionnaire.SubmittedAnswerStatus;

public record SubmittedAnswerResponseDto(Long id, String text, Integer order,
                                         SubmittedAnswerStatus status) {
}
