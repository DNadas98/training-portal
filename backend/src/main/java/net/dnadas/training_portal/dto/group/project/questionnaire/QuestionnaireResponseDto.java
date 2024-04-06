package net.dnadas.training_portal.dto.group.project.questionnaire;

public record QuestionnaireResponseDto(Long id, String name, String description,
                                       Integer maxPoints, Long submissionCount) {
}
