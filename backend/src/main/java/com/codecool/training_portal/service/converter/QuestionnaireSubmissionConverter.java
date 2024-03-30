package com.codecool.training_portal.service.converter;

import com.codecool.training_portal.dto.group.project.questionnaire.*;
import com.codecool.training_portal.model.group.project.questionnaire.Questionnaire;
import com.codecool.training_portal.model.group.project.questionnaire.QuestionnaireSubmission;
import com.codecool.training_portal.service.datetime.DateTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionnaireSubmissionConverter {
  private final DateTimeService dateTimeService;

  public QuestionnaireSubmissionResponseDto toQuestionnaireSubmissionResponseDto(
    QuestionnaireSubmission questionnaireSubmission, Questionnaire questionnaire) {
    return new QuestionnaireSubmissionResponseDto(questionnaireSubmission.getId(),
      questionnaire.getName(), questionnaire.getDescription(),
      questionnaireSubmission.getSubmittedQuestions().stream().map(
        submittedQuestion -> new SubmittedQuestionResponseDto(submittedQuestion.getId(),
          submittedQuestion.getText(), submittedQuestion.getType(),
          submittedQuestion.getReceivedPoints(), submittedQuestion.getMaxPoints(),
          submittedQuestion.getQuestionOrder(),
          submittedQuestion.getSubmittedAnswers().stream().map(
            submittedAnswer -> new SubmittedAnswerResponseDto(submittedAnswer.getId(),
              submittedAnswer.getText(), submittedAnswer.getAnswerOrder(),
              submittedAnswer.getStatus())
          ).collect(Collectors.toList()))
      ).collect(Collectors.toList()), questionnaireSubmission.getReceivedPoints(),
      questionnaireSubmission.getMaxPoints(),
      dateTimeService.toDisplayedDate(questionnaireSubmission.getCreatedAt()));
  }

  public QuestionnaireSubmissionResponseEditorDto toQuestionnaireSubmissionResponseEditorDto(
    QuestionnaireSubmission questionnaireSubmission, Questionnaire questionnaire) {
    return new QuestionnaireSubmissionResponseEditorDto(questionnaireSubmission.getId(),
      questionnaire.getName(), questionnaire.getDescription(),
      questionnaireSubmission.getSubmittedQuestions().stream().map(
        submittedQuestion -> new SubmittedQuestionResponseDto(submittedQuestion.getId(),
          submittedQuestion.getText(), submittedQuestion.getType(),
          submittedQuestion.getReceivedPoints(), submittedQuestion.getMaxPoints(),
          submittedQuestion.getQuestionOrder(),
          submittedQuestion.getSubmittedAnswers().stream().map(
            submittedAnswer -> new SubmittedAnswerResponseDto(submittedAnswer.getId(),
              submittedAnswer.getText(), submittedAnswer.getAnswerOrder(),
              submittedAnswer.getStatus())
          ).collect(Collectors.toList()))
      ).collect(Collectors.toList()), questionnaireSubmission.getReceivedPoints(),
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
}
