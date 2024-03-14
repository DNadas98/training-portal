package com.codecool.training_portal.dto.group.project.questionnaire;

import com.codecool.training_portal.model.group.project.questionnaire.QuestionnaireStatus;

import java.util.Set;

public record QuestionnaireUpdateRequestDto(String name, String description,
                                            QuestionnaireStatus status,
                                            Set<QuestionCreateRequestDto> questions) {
}
