package com.codecool.training_portal.dto.group.project.questionnaire;

import com.codecool.training_portal.model.group.project.questionnaire.QuestionType;

import java.util.List;

public record QuestionResponseDto(Long id, String text, QuestionType type, Integer points, Integer order,
                                  List<AnswerResponseDto> answers) {
}
