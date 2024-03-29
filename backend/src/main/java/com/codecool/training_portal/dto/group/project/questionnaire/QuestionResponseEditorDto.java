package com.codecool.training_portal.dto.group.project.questionnaire;

import com.codecool.training_portal.model.group.project.questionnaire.QuestionType;

import java.util.List;
import java.util.Set;

public record QuestionResponseEditorDto(Long id, String text, QuestionType type, Integer points, Integer order,
                                        List<AnswerResponseEditorDto> answers) {
}
