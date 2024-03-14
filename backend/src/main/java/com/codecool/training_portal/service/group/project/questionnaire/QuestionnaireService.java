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
  public QuestionnaireResponseDto getQuestionnaire(Long groupId, Long projectId, Long questionnaireId) {
    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(
      groupId,
      projectId,questionnaireId).orElseThrow(() -> new QuestionnaireNotFoundException());
    return questionnaireConverter.toQuestionnaireResponseDto(questionnaire);
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
  public QuestionnaireResponseEditorDto getEditorQuestionnaire(Long groupId, Long projectId, Long questionnaireId) {
    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(
      groupId,
      projectId,questionnaireId).orElseThrow(() -> new QuestionnaireNotFoundException());
    return questionnaireConverter.toQuestionnaireResponseEditorDto(questionnaire);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public QuestionnaireResponseEditorDto createQuestionnaire(
    Long groupId, Long projectId, QuestionnaireCreateUpdateRequestDto questionCreateRequestDto) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    Project project = getProject(groupId, projectId);
    Questionnaire questionnaire = createQuestionnaire(questionCreateRequestDto, project, user);
    questionnaireDao.save(questionnaire);
    return questionnaireConverter.toQuestionnaireResponseEditorDto(questionnaire);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public QuestionnaireResponseEditorDto updateQuestionnaire(
    Long groupId, Long projectId, Long questionnaireId, QuestionnaireCreateUpdateRequestDto questionCreateRequestDto) {
    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(
      groupId, projectId, questionnaireId).orElseThrow(() -> new QuestionnaireNotFoundException());
    questionnaire.setName(questionCreateRequestDto.name());
    questionnaire.setDescription(questionCreateRequestDto.description());
    questionnaire.removeAllQuestions();
    questionCreateRequestDto.questions().forEach(questionDto -> createQuestion(questionDto, questionnaire));
    questionnaireDao.save(questionnaire);
    return questionnaireConverter.toQuestionnaireResponseEditorDto(questionnaire);
  }

  public Project getProject(Long groupId, Long projectId) {
    return projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
  }

  public Questionnaire createQuestionnaire(
    QuestionnaireCreateUpdateRequestDto dto, Project project, ApplicationUser user) {
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
