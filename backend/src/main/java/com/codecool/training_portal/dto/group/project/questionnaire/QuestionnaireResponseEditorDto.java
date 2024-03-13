package com.codecool.training_portal.dto.group.project.questionnaire;
import java.util.List;

public record QuestionnaireResponseEditorDto(Long id,String name, String description,
                                             List<QuestionResponseEditorDto> questions) {
}
