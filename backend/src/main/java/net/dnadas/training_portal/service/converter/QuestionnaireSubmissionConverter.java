package net.dnadas.training_portal.service.converter;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.project.questionnaire.*;
import net.dnadas.training_portal.model.group.project.questionnaire.Questionnaire;
import net.dnadas.training_portal.model.group.project.questionnaire.QuestionnaireSubmission;
import net.dnadas.training_portal.model.group.project.questionnaire.SubmittedAnswer;
import net.dnadas.training_portal.model.group.project.questionnaire.SubmittedQuestion;
import net.dnadas.training_portal.service.datetime.DateTimeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionnaireSubmissionConverter {
  private final DateTimeService dateTimeService;

  public QuestionnaireSubmissionResponseDto toQuestionnaireSubmissionResponseDto(
    QuestionnaireSubmission questionnaireSubmission, Questionnaire questionnaire) {
    return new QuestionnaireSubmissionResponseDto(questionnaireSubmission.getId(),
      questionnaire.getName(), questionnaire.getDescription(),
      questionnaireSubmission.getReceivedPoints(),
      questionnaireSubmission.getMaxPoints(),
      dateTimeService.toDisplayedDate(questionnaireSubmission.getCreatedAt()));
  }

  public QuestionnaireSubmissionResponseDetailsDto toQuestionnaireSubmissionResponseDetailsDto(
    QuestionnaireSubmission questionnaireSubmission, Questionnaire questionnaire) {
    return new QuestionnaireSubmissionResponseDetailsDto(questionnaireSubmission.getId(),
      questionnaire.getName(), questionnaire.getDescription(),
      questionnaireSubmission.getSubmittedQuestions().stream().map(this::toSubmittedQuestionResponseDto).toList(),
      questionnaireSubmission.getReceivedPoints(),
      questionnaireSubmission.getMaxPoints(),
      dateTimeService.toDisplayedDate(questionnaireSubmission.getCreatedAt()));
  }

  @Transactional(readOnly = true)
  public QuestionnaireSubmissionResponseEditorDto toQuestionnaireSubmissionResponseEditorDto(
    QuestionnaireSubmission questionnaireSubmission, Questionnaire questionnaire) {
    return new QuestionnaireSubmissionResponseEditorDto(questionnaireSubmission.getId(),
      questionnaire.getName(), questionnaire.getDescription(), questionnaireSubmission.getReceivedPoints(),
      questionnaireSubmission.getMaxPoints(),
      dateTimeService.toDisplayedDate(questionnaireSubmission.getCreatedAt()),
      questionnaireSubmission.getStatus());
  }

  public QuestionnaireSubmissionStatsAdminDto toQuestionnaireSubmissionStatsAdminDto(
    QuestionnaireSubmissionStatsInternalDto dto) {
    Instant maxPointSubmissionCreatedAt = dto.maxPointSubmissionCreatedAt();
    String maxPointSubmissionCreatedAtResult;
    if (maxPointSubmissionCreatedAt == null) {
      maxPointSubmissionCreatedAtResult = null;
    } else {
      maxPointSubmissionCreatedAtResult = dateTimeService.toDisplayedDate(
        dto.maxPointSubmissionCreatedAt());
    }
    Instant lastSubmissionCreatedAt = dto.lastSubmissionCreatedAt();
    String lastSubmissionCreatedAtResult;
    if (lastSubmissionCreatedAt == null) {
      lastSubmissionCreatedAtResult = null;
    } else {
      lastSubmissionCreatedAtResult = dateTimeService.toDisplayedDate(
        dto.lastSubmissionCreatedAt());
    }
    return new QuestionnaireSubmissionStatsAdminDto(
      dto.questionnaireName(), dto.questionnaireMaxPoints(), dto.maxPointSubmissionId(),
      maxPointSubmissionCreatedAtResult,
      dto.maxPointSubmissionReceivedPoints(),
      dto.lastSubmissionId(),
      lastSubmissionCreatedAtResult,
      dto.lastSubmissionReceivedPoints(),
      dto.userId(), dto.username()
    );
  }

  private SubmittedQuestionResponseDto toSubmittedQuestionResponseDto(
    SubmittedQuestion submittedQuestion) {
    return new SubmittedQuestionResponseDto(submittedQuestion.getId(),
      submittedQuestion.getText(), submittedQuestion.getType(),
      submittedQuestion.getReceivedPoints(), submittedQuestion.getMaxPoints(),
      submittedQuestion.getQuestionOrder(),
      submittedQuestion.getSubmittedAnswers().stream().map(
        this::toSubmittedAnswerResponseDto
      ).collect(Collectors.toList()));
  }

  private SubmittedAnswerResponseDto toSubmittedAnswerResponseDto(
    SubmittedAnswer submittedAnswer) {
    return new SubmittedAnswerResponseDto(submittedAnswer.getId(),
      submittedAnswer.getText(), submittedAnswer.getAnswerOrder(),
      submittedAnswer.getStatus());
  }
}
