package net.dnadas.training_portal.service.group.project.questionnaire;

import lombok.RequiredArgsConstructor;
import net.dnadas.training_portal.dto.group.project.questionnaire.*;
import net.dnadas.training_portal.exception.group.project.ProjectNotFoundException;
import net.dnadas.training_portal.exception.group.project.questionnaire.QuestionnaireAlreadyActivatedException;
import net.dnadas.training_portal.exception.group.project.questionnaire.QuestionnaireNotFoundException;
import net.dnadas.training_portal.model.auth.ApplicationUser;
import net.dnadas.training_portal.model.auth.GlobalRole;
import net.dnadas.training_portal.model.group.project.Project;
import net.dnadas.training_portal.model.group.project.ProjectDao;
import net.dnadas.training_portal.model.group.project.questionnaire.*;
import net.dnadas.training_portal.service.user.UserProvider;
import net.dnadas.training_portal.service.utils.converter.QuestionnaireConverter;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionnaireService {
  private final QuestionnaireDao questionnaireDao;
  private final ProjectDao projectDao;
  private final QuestionnaireConverter questionnaireConverter;
  private final UserProvider userProvider;

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ADMIN')")
  public List<QuestionnaireResponseEditorDto> getQuestionnairesOfProject(
    Long groupId, Long projectId) {
    List<Questionnaire> questionnaires = questionnaireDao.findAllByGroupIdAndProjectId(
      groupId, projectId);
    return questionnaireConverter.toQuestionnaireResponseEditorDtos(questionnaires);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public List<QuestionnaireResponseDto> getActiveQuestionnaires(
    Long groupId, Long projectId, Boolean maxPoints) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    List<QuestionnaireResponseDto> questionnaires;
    if (maxPoints) {
      questionnaires =
        questionnaireDao.findAllByGroupIdAndProjectIdAndActiveStatusAndMaxPointSubmission(
          groupId, projectId, user);
    } else {
      questionnaires =
        questionnaireDao.findAllByGroupIdAndProjectIdAndActiveStatusAndNoMaxPointSubmission(
          groupId, projectId, user);
    }
    return questionnaires;
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_ASSIGNED_MEMBER')")
  public QuestionnaireResponseDetailsDto getQuestionnaire(
    Long groupId, Long projectId, Long questionnaireId) {
    Questionnaire questionnaire =
      questionnaireDao.findByGroupIdAndProjectIdAndIdAndActiveStatusWithQuestions(
        groupId, projectId, questionnaireId).orElseThrow(QuestionnaireNotFoundException::new);
    return questionnaireConverter.toQuestionnaireResponseDetailsDto(
      questionnaire);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public List<QuestionnaireResponseEditorDto> getEditorQuestionnaires(
    Long groupId, Long projectId) {
    List<Questionnaire> questionnaires = questionnaireDao.findAllByGroupIdAndProjectId(
      groupId, projectId);
    return questionnaireConverter.toQuestionnaireResponseEditorDtos(questionnaires);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_COORDINATOR')")
  public List<QuestionnaireResponseEditorDto> getCoordinatorQuestionnaires(
    Long groupId, Long projectId) {
    List<Questionnaire> questionnaires = questionnaireDao.findAllByGroupIdAndProjectId(
      groupId, projectId);
    return questionnaireConverter.toQuestionnaireResponseEditorDtos(questionnaires);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_COORDINATOR')")
  public QuestionnaireResponseEditorDto getCoordinatorQuestionnaire(
    Long groupId, Long projectId, Long questionnaireId) {
    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(
      groupId, projectId, questionnaireId).orElseThrow(QuestionnaireNotFoundException::new);
    return questionnaireConverter.toQuestionnaireResponseEditorDto(questionnaire);
  }

  @Transactional(readOnly = true)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public QuestionnaireResponseEditorDetailsDto getEditorQuestionnaire(
    Long groupId, Long projectId, Long questionnaireId) {
    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndIdWithQuestions(
      groupId, projectId, questionnaireId).orElseThrow(QuestionnaireNotFoundException::new);
    return questionnaireConverter.toQuestionnaireResponseEditorDetailsDto(questionnaire);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public QuestionnaireResponseEditorDetailsDto createQuestionnaire(
    Long groupId, Long projectId, QuestionnaireCreateRequestDto questionCreateRequestDto) {
    ApplicationUser user = userProvider.getAuthenticatedUser();
    Project project = projectDao.findByIdAndGroupId(projectId, groupId).orElseThrow(
      () -> new ProjectNotFoundException(projectId));
    Questionnaire questionnaire = createQuestionnaire(questionCreateRequestDto, project, user);
    questionnaireDao.save(questionnaire);
    return questionnaireConverter.toQuestionnaireResponseEditorDetailsDto(questionnaire);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public QuestionnaireResponseEditorDetailsDto updateQuestionnaire(
    Long groupId, Long projectId, Long questionnaireId,
    QuestionnaireUpdateRequestDto questionnaireUpdateRequestDto) {
    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(
      groupId, projectId, questionnaireId).orElseThrow(QuestionnaireNotFoundException::new);

    questionnaire.setName(questionnaireUpdateRequestDto.name());
    questionnaire.setDescription(questionnaireUpdateRequestDto.description());
    questionnaire.setStatus(questionnaireUpdateRequestDto.status());
    questionnaire.removeAllQuestions();
    questionnaireUpdateRequestDto.questions().forEach(
      questionDto -> {
        Question question = createQuestion(questionDto, questionnaire);
        questionnaire.addQuestion(question);
      });
    ApplicationUser user = userProvider.getAuthenticatedUser();

    questionnaire.setUpdatedBy(user);
    if (questionnaireUpdateRequestDto.status() == QuestionnaireStatus.ACTIVE) {
      questionnaire.setActivated(true);
    }
    questionnaire.setUpdatedAt(Instant.now());
    questionnaireDao.save(questionnaire);
    return questionnaireConverter.toQuestionnaireResponseEditorDetailsDto(questionnaire);
  }

  @Transactional(rollbackFor = Exception.class)
  @PreAuthorize("hasPermission(#projectId, 'Project', 'PROJECT_EDITOR')")
  public void deleteQuestionnaire(Long groupId, Long projectId, Long id) {
    Questionnaire questionnaire = questionnaireDao.findByGroupIdAndProjectIdAndId(
      groupId, projectId, id).orElseThrow(QuestionnaireNotFoundException::new);
    ApplicationUser user = userProvider.getAuthenticatedUser();
    if (!user.getGlobalRoles().contains(GlobalRole.ADMIN) && questionnaire.isActivated()) {
      throw new QuestionnaireAlreadyActivatedException();
    }
    questionnaireDao.delete(questionnaire);
  }

  private Questionnaire createQuestionnaire(
    QuestionnaireCreateRequestDto dto, Project project, ApplicationUser user) {
    Questionnaire questionnaire = new Questionnaire(dto.name(), dto.description(), project, user);
    dto.questions().forEach(questionDto -> {
      Question question = createQuestion(questionDto, questionnaire);
      questionnaire.addQuestion(question);
    });
    return questionnaire;
  }

  private Question createQuestion(
    QuestionCreateRequestDto questionDto, Questionnaire questionnaire) {
    Question question = new Question(
      questionDto.text(), questionDto.type(), questionDto.order(), questionDto.points(),
      questionnaire);
    questionDto.answers().forEach(answerDto -> {
      Answer answer = createAnswer(answerDto, question);
      question.addAnswer(answer);
    });
    return question;
  }

  private Answer createAnswer(AnswerCreateRequestDto answerDto, Question question) {
    return new Answer(answerDto.text(), answerDto.correct(), answerDto.order(), question);
  }
}
