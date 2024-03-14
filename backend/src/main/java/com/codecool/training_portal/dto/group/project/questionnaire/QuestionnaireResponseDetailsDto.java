package com.codecool.training_portal.dto.group.project.questionnaire;
import java.util.List;

public record QuestionnaireResponseDetailsDto(Long id, String name, String description,
                                              List<QuestionResponseDto> questions) {
}
