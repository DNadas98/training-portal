package net.dnadas.training_portal.dto.group.project.questionnaire;

import java.util.List;

public record QuestionnaireResponseDetailsDto(Long id, String name, String description,
                                              Integer maxPoints,
                                              List<QuestionResponseDto> questions,
                                              String updatedAt) {
}
