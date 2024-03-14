package com.codecool.training_portal.dto.group.project.questionnaire;

import java.util.Set;

public record QuestionnaireCreateUpdateRequestDto(String name, String description,
                                                  Set<QuestionCreateRequestDto> questions) {
}
