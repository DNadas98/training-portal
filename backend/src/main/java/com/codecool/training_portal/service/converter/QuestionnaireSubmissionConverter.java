package com.codecool.training_portal.service.converter;

import com.codecool.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionResponseDto;
import com.codecool.training_portal.dto.group.project.questionnaire.SubmittedAnswerResponseDto;
import com.codecool.training_portal.dto.group.project.questionnaire.SubmittedQuestionResponseDto;
import com.codecool.training_portal.model.group.project.questionnaire.Questionnaire;
import com.codecool.training_portal.model.group.project.questionnaire.QuestionnaireSubmission;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class QuestionnaireSubmissionConverter {

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
      ).collect(Collectors.toList()));
  }
}
