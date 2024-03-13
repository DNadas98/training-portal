package com.codecool.training_portal.service.converter;

import com.codecool.training_portal.dto.group.project.questionnaire.AnswerResponseEditorDto;
import com.codecool.training_portal.dto.group.project.questionnaire.QuestionResponseEditorDto;
import com.codecool.training_portal.dto.group.project.questionnaire.QuestionnaireResponseEditorDto;
import com.codecool.training_portal.model.group.project.questionnaire.Answer;
import com.codecool.training_portal.model.group.project.questionnaire.Question;
import com.codecool.training_portal.model.group.project.questionnaire.Questionnaire;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionnaireConverter {
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

  public QuestionResponseEditorDto toQuestionResponseEditorDto(Question question) {
    return new QuestionResponseEditorDto(
      question.getId(), question.getText(), question.getType(), question.getPoints(), question.getQuestionOrder(),
      question.getAnswers().stream().map(this::toAnswerResponseEditorDto)
        .collect(Collectors.toList()));
  }

  public AnswerResponseEditorDto toAnswerResponseEditorDto(Answer answer) {
    return new AnswerResponseEditorDto(
      answer.getId(), answer.getText(), answer.getCorrect(), answer.getAnswerOrder());
  }
}
