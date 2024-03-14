package com.codecool.training_portal.service.converter;

import com.codecool.training_portal.dto.group.project.questionnaire.*;
import com.codecool.training_portal.model.group.project.questionnaire.Answer;
import com.codecool.training_portal.model.group.project.questionnaire.Question;
import com.codecool.training_portal.model.group.project.questionnaire.Questionnaire;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionnaireConverter {
  public List<QuestionnaireResponseDto> toQuestionnaireResponseDtos(
    List<Questionnaire> questionnaires) {
    return questionnaires.stream().map(this::toQuestionnaireResponseDto).collect(
      Collectors.toList());
  }

  public QuestionnaireResponseDto toQuestionnaireResponseDto(
    Questionnaire questionnaire) {
    return new QuestionnaireResponseDto(
      questionnaire.getId(), questionnaire.getName(), questionnaire.getDescription(),
      questionnaire.getQuestions().stream().map(this::toQuestionResponseDto).collect(
        Collectors.toList()));
  }

  public List<QuestionnaireResponseEditorDto> toQuestionnaireResponseEditorDtos(
    List<Questionnaire> questionnaires) {
    return questionnaires.stream().map(this::toQuestionnaireResponseEditorDto).collect(
      Collectors.toList());
  }

  public QuestionnaireResponseEditorDto toQuestionnaireResponseEditorDto(
    Questionnaire questionnaire) {
    return new QuestionnaireResponseEditorDto(
      questionnaire.getId(), questionnaire.getName(), questionnaire.getDescription(),
      questionnaire.getQuestions().stream().map(this::toQuestionResponseEditorDto).collect(
        Collectors.toList()));
  }

  private QuestionResponseDto toQuestionResponseDto(Question question) {
    return new QuestionResponseDto(
      question.getId(), question.getText(), question.getType(), question.getPoints(),
      question.getQuestionOrder(),
      question.getAnswers().stream().map(this::toAnswerResponseDto)
        .collect(Collectors.toList()));
  }

  private AnswerResponseDto toAnswerResponseDto(Answer answer) {
    return new AnswerResponseDto(
      answer.getId(), answer.getText(), answer.getAnswerOrder());
  }

  private QuestionResponseEditorDto toQuestionResponseEditorDto(Question question) {
    return new QuestionResponseEditorDto(
      question.getId(), question.getText(), question.getType(), question.getPoints(),
      question.getQuestionOrder(),
      question.getAnswers().stream().map(this::toAnswerResponseEditorDto)
        .collect(Collectors.toList()));
  }

  private AnswerResponseEditorDto toAnswerResponseEditorDto(Answer answer) {
    return new AnswerResponseEditorDto(
      answer.getId(), answer.getText(), answer.getCorrect(), answer.getAnswerOrder());
  }
}
