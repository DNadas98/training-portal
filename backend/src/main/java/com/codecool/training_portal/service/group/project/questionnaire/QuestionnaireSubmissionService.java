package com.codecool.training_portal.service.group.project.questionnaire;

import com.codecool.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionRequestDto;
import com.codecool.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionResponseDto;
import com.codecool.training_portal.dto.group.project.questionnaire.SubmittedAnswerRequestDto;
import com.codecool.training_portal.dto.group.project.questionnaire.SubmittedQuestionRequestDto;
import com.codecool.training_portal.exception.group.project.questionnaire.QuestionnaireNotFoundException;
import com.codecool.training_portal.exception.group.project.questionnaire.QuestionnaireSubmissionFailedException;
import com.codecool.training_portal.exception.group.project.questionnaire.QuestionnaireSubmissionNotFoundException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.project.questionnaire.*;
import com.codecool.training_portal.service.auth.UserProvider;
import com.codecool.training_portal.service.converter.QuestionnaireSubmissionConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionnaireSubmissionService {
  private final QuestionnaireDao questionnaireDao;
  private final QuestionnaireSubmissionDao questionnaireSubmissionDao;
  private final SubmittedQuestionDao submittedQuestionDao;
  private final SubmittedAnswerDao submittedAnswerDao;
  private final QuestionnaireSubmissionConverter questionnaireSubmissionConverter;
  private final UserProvider userProvider;

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public List<QuestionnaireSubmissionResponseDto> getOwnQuestionnaireSubmissions(
    Long groupId, Long projectId, Long questionnaireId) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    List<QuestionnaireSubmission> questionnaireSubmissions;
    questionnaireSubmissions =
      questionnaireSubmissionDao.findAllByGroupIdAndProjectIdAndQuestionnaireIdAndUserAndNotMaxPoint(
        groupId, projectId, questionnaireId, user);
    List<QuestionnaireSubmissionResponseDto> questionnaireSubmissionResponseDtos =
      questionnaireSubmissions.stream().map(
        questionnaireSubmission -> questionnaireSubmissionConverter.toQuestionnaireSubmissionResponseDto(
          questionnaireSubmission, questionnaireSubmission.getQuestionnaire())).toList();
    return questionnaireSubmissionResponseDtos;
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public QuestionnaireSubmissionResponseDto getOwnQuestionnaireSubmission(
    Long groupId, Long projectId, Long questionnaireId, Long submissionId) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    QuestionnaireSubmission questionnaireSubmission =
      questionnaireSubmissionDao.findByGroupIdAndProjectIdAndQuestionnaireIdAndIdAndUser(groupId,
        projectId, questionnaireId, submissionId, user).orElseThrow(
        QuestionnaireSubmissionNotFoundException::new);
    return questionnaireSubmissionConverter.toQuestionnaireSubmissionResponseDto(
      questionnaireSubmission, questionnaireSubmission.getQuestionnaire());
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public QuestionnaireSubmissionResponseDto getMaxPointQuestionnaireSubmission(
    Long groupId, Long projectId, Long questionnaireId) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    QuestionnaireSubmission questionnaireSubmission =
      questionnaireSubmissionDao.findByGroupIdAndProjectIdAndQuestionnaireIdAndUserAndMaxPoint(
        groupId,
        projectId, questionnaireId, user).orElseThrow(
        QuestionnaireSubmissionNotFoundException::new);
    return questionnaireSubmissionConverter.toQuestionnaireSubmissionResponseDto(
      questionnaireSubmission, questionnaireSubmission.getQuestionnaire());
  }


  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public void submitQuestionnaire(
    Long groupId, Long projectId, Long questionnaireId,
    QuestionnaireSubmissionRequestDto submissionRequest) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(groupId,
      projectId, questionnaireId).orElseThrow(QuestionnaireNotFoundException::new);

    Optional<QuestionnaireSubmission> maxPointSubmission =
      questionnaireSubmissionDao.findByGroupIdAndProjectIdAndQuestionnaireIdAndUserAndMaxPoint(
        groupId, projectId, questionnaireId, user);
    if (maxPointSubmission.isPresent()) {
      throw new QuestionnaireSubmissionFailedException();
    }

    List<Question> questions = questionnaire.getQuestions();
    QuestionnaireSubmission submission = new QuestionnaireSubmission(questionnaire, user);
    questionnaireSubmissionDao.save(submission);

    QuestionnaireSubmission savedSubmission = processQuestionnaireSubmission(
      submissionRequest, questions, submission);

    if (savedSubmission == null) {
      throw new QuestionnaireSubmissionFailedException();
    }
  }

  private QuestionnaireSubmission processQuestionnaireSubmission(
    QuestionnaireSubmissionRequestDto submissionRequest, List<Question> questions,
    QuestionnaireSubmission submission) {
    int submissionTotalPoints = 0;
    int submissionReceivedPoints = 0;
    List<SubmittedQuestion> submittedQuestions = new ArrayList<>();
    for (SubmittedQuestionRequestDto submittedQuestionDto : submissionRequest.questions()) {
      Question question = questions.stream().filter(
          q -> q.getId().equals(submittedQuestionDto.questionId()))
        .findFirst().orElseThrow(QuestionnaireSubmissionFailedException::new);
      List<SubmittedAnswer> submittedAnswers = new ArrayList<>();

      final int maxPoints = question.getPoints();
      int receivedPoints = 0;
      List<SubmittedAnswerRequestDto> checkedAnswerDtos = submittedQuestionDto.checkedAnswers();
      List<Answer> allAnswers = question.getAnswers();
      Set<Long> correctAnswerIds = allAnswers.stream()
        .filter(Answer::getCorrect)
        .map(Answer::getId)
        .collect(Collectors.toSet());

      // Since we have agreed on max or zero points for every question
      if (checkedAnswerDtos.stream()
        .filter(dto -> correctAnswerIds
          .contains(dto.answerId()))
        .count() == correctAnswerIds.size()) {
        receivedPoints += maxPoints;
      }

      submissionReceivedPoints += receivedPoints;
      submissionTotalPoints += maxPoints;

      SubmittedQuestion newSubmittedQuestion = new SubmittedQuestion(question.getText(),
        question.getType(), question.getQuestionOrder(), maxPoints, receivedPoints, submission);
      submittedQuestions.add(newSubmittedQuestion);

      handleAnswers(
        checkedAnswerDtos, allAnswers, correctAnswerIds, submittedAnswers, newSubmittedQuestion);
      submittedQuestionDao.save(newSubmittedQuestion);
      submittedAnswerDao.saveAll(submittedAnswers);
    }
    submission.setMaxPoints(submissionTotalPoints);
    submission.setReceivedPoints(submissionReceivedPoints);
    submission.setSubmittedQuestions(submittedQuestions);

    return questionnaireSubmissionDao.save(submission);
  }

  private void handleAnswers(
    List<SubmittedAnswerRequestDto> checkedAnswers, List<Answer> allAnswers,
    Set<Long> correctAnswerIds, List<SubmittedAnswer> submittedAnswers,
    SubmittedQuestion newSubmittedQuestion) {

    Set<Answer> remainingAnswers = new HashSet<>(allAnswers);

    for (SubmittedAnswerRequestDto checkedAnswer : checkedAnswers) {
      Answer answer = remainingAnswers.stream().filter(
          a -> a.getId().equals(checkedAnswer.answerId()))
        .findFirst().orElseThrow(QuestionnaireSubmissionFailedException::new);

      SubmittedAnswerStatus answerStatus = correctAnswerIds.contains(answer.getId()) ?
        SubmittedAnswerStatus.CORRECT : SubmittedAnswerStatus.INCORRECT;

      submittedAnswers.add(
        new SubmittedAnswer(answer.getText(), answer.getAnswerOrder(), answerStatus,
          newSubmittedQuestion));

      remainingAnswers.remove(answer);
    }

    for (Answer remainingAnswer : remainingAnswers) {
      submittedAnswers.add(
        new SubmittedAnswer(remainingAnswer.getText(), remainingAnswer.getAnswerOrder(),
          SubmittedAnswerStatus.UNCHECKED, newSubmittedQuestion));
    }
  }
}
