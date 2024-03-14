package com.codecool.training_portal.dto.group.project.questionnaire;

import com.codecool.training_portal.model.group.project.questionnaire.SubmittedAnswerStatus;

public record SubmittedAnswerResponseDto(Long id, String text, Integer order,
                                         SubmittedAnswerStatus status) {
}
