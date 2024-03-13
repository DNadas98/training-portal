package com.codecool.training_portal.dto.group.project.questionnaire;

import com.codecool.training_portal.model.group.project.questionnaire.QuestionType;

import java.util.Set;

public record QuestionCreateRequestDto(String text, QuestionType type, Integer order, Integer points,
                                       Set<AnswerCreateRequestDto> answers) {
}
