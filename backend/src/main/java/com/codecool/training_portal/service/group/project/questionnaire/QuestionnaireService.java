package com.codecool.training_portal.service.group.project.questionnaire;

import com.codecool.training_portal.dto.group.project.questionnaire.*;
import com.codecool.training_portal.exception.group.project.ProjectNotFoundException;
import com.codecool.training_portal.exception.group.project.questionnaire.QuestionnaireNotFoundException;
import com.codecool.training_portal.model.auth.ApplicationUser;
import com.codecool.training_portal.model.group.project.Project;
import com.codecool.training_portal.model.group.project.ProjectDao;
import com.codecool.training_portal.model.group.project.questionnaire.*;
import com.codecool.training_portal.service.auth.UserProvider;
import com.codecool.training_portal.service.converter.QuestionnaireConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionnaireService {
  private final QuestionnaireDao questionnaireDao;
  private final ProjectDao projectDao;
  private final QuestionnaireConverter questionnaireConverter;
  private final UserProvider userProvider;

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public List<QuestionnaireResponseDto> getQuestionnaires(Long groupId, Long projectId) {
    List<Questionnaire> questionnaires = questionnaireDao.findAllByGroupIdAndProjectId(
      groupId,
      projectId);
    return questionnaireConverter.toQuestionnaireResponseDtos(questionnaires);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public QuestionnaireResponseDetailsDto getQuestionnaire(Long groupId, Long projectId, Long questionnaireId) {
    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(
      groupId,
      projectId,questionnaireId).orElseThrow(() -> new QuestionnaireNotFoundException());
    return questionnaireConverter.toQuestionnaireResponseDetailsDto(questionnaire);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public List<QuestionnaireResponseEditorDto> getEditorQuestionnaires(Long groupId, Long projectId) {
    List<Questionnaire> questionnaires = questionnaireDao.findAllByGroupIdAndProjectId(
      groupId,
      projectId);
    return questionnaireConverter.toQuestionnaireResponseEditorDtos(questionnaires);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public QuestionnaireResponseEditorDetailsDto getEditorQuestionnaire(Long groupId, Long projectId, Long questionnaireId) {
    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(
      groupId,
      projectId,questionnaireId).orElseThrow(() -> new QuestionnaireNotFoundException());
    return questionnaireConverter.toQuestionnaireResponseEditorDetailsDto(questionnaire);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public QuestionnaireResponseEditorDetailsDto createQuestionnaire(
    Long groupId, Long projectId, QuestionnaireCreateRequestDto questionCreateRequestDto) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    Project project = getProject(groupId, projectId);
    Questionnaire questionnaire = createQuestionnaire(questionCreateRequestDto, project, user);
    questionnaireDao.save(questionnaire);
    return questionnaireConverter.toQuestionnaireResponseEditorDetailsDto(questionnaire);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public QuestionnaireResponseEditorDetailsDto updateQuestionnaire(
    Long groupId, Long projectId, Long questionnaireId, QuestionnaireUpdateRequestDto questionnaireUpdateRequestDto) {
    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(
      groupId, projectId, questionnaireId).orElseThrow(() -> new QuestionnaireNotFoundException());
    questionnaire.setName(questionnaireUpdateRequestDto.name());
    questionnaire.setDescription(questionnaireUpdateRequestDto.description());
    questionnaire.setStatus(questionnaireUpdateRequestDto.status());
    questionnaire.removeAllQuestions();
    questionnaireUpdateRequestDto.questions().forEach(questionDto -> createQuestion(questionDto, questionnaire));
    questionnaireDao.save(questionnaire);
    return questionnaireConverter.toQuestionnaireResponseEditorDetailsDto(questionnaire);
  }

  public Project getProject(Long groupId, Long projectId) {
    return projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
  }

  public Questionnaire createQuestionnaire(
    QuestionnaireCreateRequestDto dto, Project project, ApplicationUser user) {
    Questionnaire questionnaire = new Questionnaire(dto.name(), dto.description(), project, user);
    dto.questions().forEach(questionDto -> createQuestion(questionDto, questionnaire));
    return questionnaire;
  }

  private void createQuestion(QuestionCreateRequestDto questionDto, Questionnaire questionnaire) {
    Question question = new Question(
      questionDto.text(), questionDto.type(), questionDto.order(), questionDto.points(),
      questionnaire);
    questionDto.answers().forEach(answerDto -> createAnswer(answerDto, question));
    questionnaire.addQuestion(question);
  }

  private void createAnswer(AnswerCreateRequestDto answerDto, Question question) {
    Answer answer = new Answer(answerDto.text(), answerDto.correct(), answerDto.order(), question);
    question.addAnswer(answer);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public void deleteQuestionnaire(Long groupId, Long projectId, Long id) {
    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(
      groupId, projectId, id).orElseThrow(() -> new QuestionnaireNotFoundException());
    questionnaireDao.delete(questionnaire);
  }
}
