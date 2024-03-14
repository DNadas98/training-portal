package com.codecool.training_portal.dto.group.project.questionnaire;

import java.util.Set;

public record QuestionnaireCreateRequestDto(String name, String description,
                                            Set<QuestionCreateRequestDto> questions) {
}
