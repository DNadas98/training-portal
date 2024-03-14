package com.codecool.training_portal.service.group.project.questionnaire;

import com.codecool.training_portal.dto.group.project.questionnaire.QuestionnaireSubmissionResponseDto;
import com.codecool.training_portal.exception.group.project.questionnaire.QuestionnaireSubmissionNotFoundException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.project.questionnaire.*;
import com.codecool.training_portal.service.auth.UserProvider;
import com.codecool.training_portal.service.converter.QuestionnaireSubmissionConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionnaireSubmissionService {
  private final QuestionnaireSubmissionDao questionnaireSubmissionDao;
  private final QuestionnaireSubmissionConverter questionnaireSubmissionConverter;
  private final UserProvider userProvider;

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public List<QuestionnaireSubmissionResponseDto> getQuestionnaireSubmissions(
    Long groupId, Long projectId, Long questionnaireId) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    List<QuestionnaireSubmission> questionnaireSubmissions =
      questionnaireSubmissionDao.findAllByGroupIdAndProjectIdAndQuestionnaireIdAndUser(groupId,
        projectId, questionnaireId, user);
    List<QuestionnaireSubmissionResponseDto> questionnaireSubmissionResponseDtos =
      questionnaireSubmissions.stream().map(
        questionnaireSubmission -> questionnaireSubmissionConverter.toQuestionnaireSubmissionResponseDto(
          questionnaireSubmission, questionnaireSubmission.getQuestionnaire())).toList();
    return questionnaireSubmissionResponseDtos;
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public QuestionnaireSubmissionResponseDto getQuestionnaireSubmission(
    Long groupId, Long projectId, Long questionnaireId, Long submissionId) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    QuestionnaireSubmission questionnaireSubmission =
      questionnaireSubmissionDao.findByGroupIdAndProjectIdAndQuestionnaireIdAndIdAndUser(groupId,
        projectId, questionnaireId, submissionId, user).orElseThrow(
        () -> new QuestionnaireSubmissionNotFoundException());
    return questionnaireSubmissionConverter.toQuestionnaireSubmissionResponseDto(
      questionnaireSubmission, questionnaireSubmission.getQuestionnaire());
  }

}
