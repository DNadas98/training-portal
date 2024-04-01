package com.codecool.training_portal.service.converter;

import com.codecool.training_portal.dto.group.project.questionnaire.*;
import com.codecool.training_portal.dto.user.UserResponsePublicDto;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.project.questionnaire.Answer;
import com.codecool.training_portal.model.group.project.questionnaire.Question;
import com.codecool.training_portal.model.group.project.questionnaire.Questionnaire;
import com.codecool.training_portal.service.datetime.DateTimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionnaireConverter {
  private final UserConverter userConverter;
  private final DateTimeService dateTimeService;

  public List<QuestionnaireResponseDto> toQuestionnaireResponseDtos(
    List<Questionnaire> questionnaires) {
    return questionnaires.stream().map(
      questionnaire -> new QuestionnaireResponseDto(questionnaire.getId(), questionnaire.getName(),
        questionnaire.getDescription(), questionnaire.getMaxPoints())).collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public QuestionnaireResponseDetailsDto toQuestionnaireResponseDetailsDto(
    Questionnaire questionnaire) {
    return new QuestionnaireResponseDetailsDto(questionnaire.getId(),
      questionnaire.getName(), questionnaire.getDescription(), questionnaire.getMaxPoints(),
      questionnaire.getQuestions().stream().map(this::toQuestionResponseDto)
        .collect(Collectors.toList()),dateTimeService.toDisplayedDate(questionnaire.getUpdatedAt()));
  }

  @Transactional(readOnly = true)
  public List<QuestionnaireResponseEditorDto> toQuestionnaireResponseEditorDtos(
    List<Questionnaire> questionnaires) {
    return questionnaires.stream().map(this::toQuestionnaireResponseEditorDto).collect(
      Collectors.toList());
  }

  @Transactional(readOnly = true)
  public QuestionnaireResponseEditorDetailsDto toQuestionnaireResponseEditorDetailsDto(
    Questionnaire questionnaire) {
    List<QuestionResponseEditorDto> questions = questionnaire.getQuestions().stream()
      .map(this::toQuestionResponseEditorDto).collect(Collectors.toList());
    QuestionnaireResponseEditorDto dto = toQuestionnaireResponseEditorDto(
      questionnaire);
    return new QuestionnaireResponseEditorDetailsDto(
      questionnaire.getId(), questionnaire.getName(), questionnaire.getDescription(),
      questionnaire.getStatus(), questionnaire.getMaxPoints(), dto.createdBy(), dto.createdAt(),
      dto.updatedBy(), dto.updatedAt(),
      questions);
  }

  private QuestionnaireResponseEditorDto toQuestionnaireResponseEditorDto(
    Questionnaire questionnaire) {
    final UserResponsePublicDto createdByDto;
    final UserResponsePublicDto updatedByDto;
    ApplicationUser createdBy = questionnaire.getCreatedBy();
    if (createdBy == null) {
      createdByDto = new UserResponsePublicDto(0L, "Removed User Account");
    } else {
      createdByDto = userConverter.toUserResponsePublicDto(createdBy);
    }
    ApplicationUser updatedBy = questionnaire.getUpdatedBy();
    if (updatedBy == null) {
      updatedByDto = new UserResponsePublicDto(0L, "Removed User Account");
    } else {
      updatedByDto = userConverter.toUserResponsePublicDto(updatedBy);
    }
    String createdAt = dateTimeService.toDisplayedDate(questionnaire.getCreatedAt());
    String updatedAt = dateTimeService.toDisplayedDate(questionnaire.getUpdatedAt());
    return new QuestionnaireResponseEditorDto(
      questionnaire.getId(), questionnaire.getName(), questionnaire.getDescription(),
      questionnaire.getStatus(), questionnaire.getMaxPoints(), createdByDto, createdAt,
      updatedByDto, updatedAt);
  }

  private QuestionResponseDto toQuestionResponseDto(Question question) {
    return new QuestionResponseDto(question.getId(), question.getText(), question.getType(),
      question.getPoints(), question.getQuestionOrder(),
      question.getAnswers().stream().map(this::toAnswerResponseDto).collect(Collectors.toList()));
  }

  private AnswerResponseDto toAnswerResponseDto(Answer answer) {
    return new AnswerResponseDto(answer.getId(), answer.getText(), answer.getAnswerOrder());
  }

  private QuestionResponseEditorDto toQuestionResponseEditorDto(Question question) {
    return new QuestionResponseEditorDto(question.getId(), question.getText(), question.getType(),
      question.getPoints(), question.getQuestionOrder(),
      question.getAnswers().stream().map(this::toAnswerResponseEditorDto)
        .collect(Collectors.toList()));
  }

  private AnswerResponseEditorDto toAnswerResponseEditorDto(Answer answer) {
    return new AnswerResponseEditorDto(
      answer.getId(), answer.getText(), answer.getCorrect(), answer.getAnswerOrder());
  }
}
