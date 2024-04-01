package com.codecool.training_portal.service.group.project.questionnaire;

import com.codecool.training_portal.dto.group.project.questionnaire.*;
import com.codecool.training_portal.exception.group.project.questionnaire.QuestionnaireNotFoundException;
import com.codecool.training_portal.exception.group.project.questionnaire.QuestionnaireSubmissionFailedException;
import com.codecool.training_portal.exception.group.project.questionnaire.QuestionnaireSubmissionNotFoundException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.auth.PermissionType;
import com.codecool.training_portal.model.group.project.questionnaire.*;
import com.codecool.training_portal.service.auth.UserProvider;
import com.codecool.training_portal.service.converter.QuestionnaireSubmissionConverter;
import com.codecool.training_portal.service.group.project.ProjectService;
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
  private final ProjectService projectService;

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
  public Optional<QuestionnaireSubmissionResponseDto> getMaxPointQuestionnaireSubmission(
    Long groupId, Long projectId, Long questionnaireId) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    Optional<QuestionnaireSubmission> questionnaireSubmission =
      questionnaireSubmissionDao.findByGroupIdAndProjectIdAndQuestionnaireIdAndUserAndMaxPoint(
        groupId, projectId, questionnaireId, user);
    if (questionnaireSubmission.isEmpty()) {
      return Optional.empty();
    }
    return Optional.of(questionnaireSubmissionConverter.toQuestionnaireSubmissionResponseDto(
      questionnaireSubmission.get(), questionnaireSubmission.get().getQuestionnaire()));
  }


  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public void submitQuestionnaire(
    Long groupId, Long projectId, Long questionnaireId,
    QuestionnaireSubmissionRequestDto submissionRequest) {
    ApplicationUser user = userProvider.getAuthenticatedUser();

    if (submissionRequest.questions().isEmpty()) {
      throw new QuestionnaireSubmissionFailedException();
    }

    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(groupId,
      projectId, questionnaireId).orElseThrow(QuestionnaireNotFoundException::new);
    verifyAllRadioButtonQuestionIsAnswered(submissionRequest, questionnaire);

    // Non-editors can only submit active questionnaires without existing max point submission
    // Editors still can not submit inactive questionnaires
    if (!projectService.getUserPermissionsForProject(groupId, projectId).contains(
      PermissionType.PROJECT_EDITOR)) {
      verifyActiveAndWithoutMaxPointSubmission(groupId, projectId, questionnaire, user);
    } else if (questionnaire.getStatus().equals(QuestionnaireStatus.INACTIVE)) {
      throw new QuestionnaireSubmissionFailedException();
    }

    List<Question> questions = questionnaire.getQuestions();
    QuestionnaireSubmission submission = new QuestionnaireSubmission(questionnaire, user,
      questionnaire.getStatus());
    questionnaireSubmissionDao.save(submission);

    QuestionnaireSubmission savedSubmission = processQuestionnaireSubmission(
      submissionRequest, questions, submission);

    if (savedSubmission == null) {
      questionnaireSubmissionDao.delete(submission);
      throw new QuestionnaireSubmissionFailedException();
    }
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public List<QuestionnaireSubmissionResponseEditorDto> getOwnQuestionnaireSubmissionsAsEditor(
    Long groupId, Long projectId, Long questionnaireId) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    List<QuestionnaireSubmission> questionnaireSubmissions;
    questionnaireSubmissions =
      questionnaireSubmissionDao.findAllByGroupIdAndProjectIdAndQuestionnaireIdAndUser(
        groupId, projectId, questionnaireId, user);
    List<QuestionnaireSubmissionResponseEditorDto> responseDtos =
      questionnaireSubmissions.stream().map(
        questionnaireSubmission -> questionnaireSubmissionConverter
          .toQuestionnaireSubmissionResponseEditorDto(
            questionnaireSubmission, questionnaireSubmission.getQuestionnaire())).toList();
    return responseDtos;
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public List<QuestionnaireSubmissionStatsAdminDto> getQuestionnaireSubmissionStatistics(
    Long groupId, Long projectId, Long questionnaireId, QuestionnaireStatus status) {
    final List<QuestionnaireSubmissionStatsInternalDto> questionnaireStats;
    if (!status.equals(QuestionnaireStatus.ACTIVE)) {
      return getNonActiveQuestionnaireStatistics(groupId, projectId, questionnaireId, status);
    }
    questionnaireStats = questionnaireSubmissionDao
      .getActiveQuestionnaireSubmissionStatistics(groupId, projectId, questionnaireId);
    List<QuestionnaireSubmissionStatsInternalDto> questionnaireStatsOfAllMembers = new ArrayList<>(
      questionnaireStats);
    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(groupId,
      projectId, questionnaireId).orElseThrow(QuestionnaireNotFoundException::new);
    List<QuestionnaireSubmissionStatsInternalDto> memberWithoutSubmissionDtos =
      questionnaireSubmissionDao.findMembersWithoutSubmissionsForQuestionnaire(
        groupId, projectId, questionnaireId, status).stream().map(
        user -> new QuestionnaireSubmissionStatsInternalDto(
          questionnaire.getName(), questionnaire.getMaxPoints(), null, null, null, null, null, null,
          user.getId(), user.getActualUsername())).toList();
    questionnaireStatsOfAllMembers.addAll(memberWithoutSubmissionDtos);

    List<QuestionnaireSubmissionStatsAdminDto> responseDtos =
      questionnaireStatsOfAllMembers.stream().map(
        questionnaireSubmissionConverter::toQuestionnaireSubmissionStatsAdminDto).toList();
    return responseDtos;
  }


  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public void deleteQuestionnaireSubmission(
    Long groupId, Long projectId, Long questionnaireId, Long submissionId) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    QuestionnaireSubmission questionnaireSubmission =
      questionnaireSubmissionDao.findByGroupIdAndProjectIdAndQuestionnaireIdAndIdAndUser(
        groupId, projectId, questionnaireId, submissionId, user).orElseThrow(
        QuestionnaireSubmissionNotFoundException::new);
    questionnaireSubmissionDao.delete(questionnaireSubmission);
  }


  private void verifyAllRadioButtonQuestionIsAnswered(
    QuestionnaireSubmissionRequestDto submissionRequest, Questionnaire questionnaire) {
    List<Question> questions = questionnaire.getQuestions();
    if (submissionRequest.questions().stream().anyMatch(
      submittedQuestion -> submittedQuestion.checkedAnswers().isEmpty()
        && questions.stream().filter(q -> submittedQuestion.questionId().equals(q.getId()))
        .findFirst().orElseThrow(QuestionnaireSubmissionFailedException::new).getType()
        .equals(QuestionType.RADIO))) {
      throw new QuestionnaireSubmissionFailedException();
    }
  }

  private void verifyActiveAndWithoutMaxPointSubmission(
    Long groupId, Long projectId, Questionnaire questionnaire,
    ApplicationUser user) {
    if (!questionnaire.getStatus().equals(QuestionnaireStatus.ACTIVE)) {
      throw new QuestionnaireSubmissionFailedException();
    }
    Optional<QuestionnaireSubmission> maxPointSubmission =
      questionnaireSubmissionDao.findByGroupIdAndProjectIdAndQuestionnaireIdAndUserAndMaxPoint(
        groupId, projectId, questionnaire.getId(), user);
    if (maxPointSubmission.isPresent()) {
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

      final int maxPoints = question.getPoints();
      int receivedPoints = 0;
      List<SubmittedAnswerRequestDto> checkedAnswerDtos = submittedQuestionDto.checkedAnswers();
      if (question.getType().equals(QuestionType.RADIO) && checkedAnswerDtos.size() > 1) {
        throw new QuestionnaireSubmissionFailedException();
      }

      List<Answer> allAnswers = question.getAnswers();
      Set<Long> correctAnswerIds = allAnswers.stream()
        .filter(Answer::getCorrect)
        .map(Answer::getId)
        .collect(Collectors.toSet());
      List<SubmittedAnswerRequestDto> checkedCorrectAnswerDtos = checkedAnswerDtos.stream()
        .filter(dto -> correctAnswerIds
          .contains(dto.answerId())).toList();

      // Since max or zero, and only integer points for every question was specified
      if (checkedCorrectAnswerDtos.size() == correctAnswerIds.size() &&
        checkedAnswerDtos.size() == checkedCorrectAnswerDtos.size()) {
        receivedPoints += maxPoints;
      }

      submissionReceivedPoints += receivedPoints;
      submissionTotalPoints += maxPoints;

      SubmittedQuestion newSubmittedQuestion = new SubmittedQuestion(question.getText(),
        question.getType(), question.getQuestionOrder(), maxPoints, receivedPoints, submission);
      submittedQuestions.add(newSubmittedQuestion);

      Set<SubmittedAnswer> submittedAnswers = processSubmittedAnswers(
        checkedAnswerDtos, allAnswers, correctAnswerIds, newSubmittedQuestion);
      submittedQuestionDao.save(newSubmittedQuestion);
      submittedAnswerDao.saveAll(submittedAnswers);
    }
    submission.setMaxPoints(submissionTotalPoints);
    submission.setReceivedPoints(submissionReceivedPoints);
    submission.setSubmittedQuestions(submittedQuestions);

    return questionnaireSubmissionDao.save(submission);
  }

  private Set<SubmittedAnswer> processSubmittedAnswers(
    List<SubmittedAnswerRequestDto> checkedAnswers, List<Answer> allAnswers,
    Set<Long> correctAnswerIds, SubmittedQuestion newSubmittedQuestion) {
    Set<SubmittedAnswer> submittedAnswers = new HashSet<>();
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
      return submittedAnswers;
    }

    for (Answer remainingAnswer : remainingAnswers) {
      submittedAnswers.add(
        new SubmittedAnswer(remainingAnswer.getText(), remainingAnswer.getAnswerOrder(),
          SubmittedAnswerStatus.UNCHECKED, newSubmittedQuestion));
    }

    return submittedAnswers;
  }

  private List<QuestionnaireSubmissionStatsAdminDto> getNonActiveQuestionnaireStatistics(
    Long groupId, Long projectId, Long questionnaireId, QuestionnaireStatus status) {
    List<QuestionnaireSubmissionStatsInternalDto> questionnaireStats = questionnaireSubmissionDao
      .getQuestionnaireSubmissionStatisticsByStatus(groupId, projectId, questionnaireId, status);
    if (questionnaireStats.isEmpty()) {
      return new ArrayList<>();
    }
    return questionnaireStats.stream().filter(dto -> dto.lastSubmissionCreatedAt() != null).map(
      questionnaireSubmissionConverter::toQuestionnaireSubmissionStatsAdminDto).toList();
  }
}
