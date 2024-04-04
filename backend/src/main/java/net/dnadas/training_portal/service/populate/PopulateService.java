package net.dnadas.training_portal.service.populate;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.dnadas.training_portal.model.auth.ApplicationUser;
import net.dnadas.training_portal.model.auth.ApplicationUserDao;
import net.dnadas.training_portal.model.group.UserGroup;
import net.dnadas.training_portal.model.group.UserGroupDao;
import net.dnadas.training_portal.model.group.project.Project;
import net.dnadas.training_portal.model.group.project.ProjectDao;
import net.dnadas.training_portal.model.group.project.questionnaire.*;
import net.dnadas.training_portal.model.group.project.task.Importance;
import net.dnadas.training_portal.model.group.project.task.Task;
import net.dnadas.training_portal.model.group.project.task.TaskDao;
import net.dnadas.training_portal.model.group.project.task.TaskStatus;
import net.dnadas.training_portal.model.request.ProjectJoinRequest;
import net.dnadas.training_portal.model.request.ProjectJoinRequestDao;
import net.dnadas.training_portal.model.request.UserGroupJoinRequest;
import net.dnadas.training_portal.model.request.UserGroupJoinRequestDao;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Profile("dev")
@Service
@Slf4j
@RequiredArgsConstructor
public class PopulateService {
  private final ApplicationUserDao applicationUserDao;
  private final PasswordEncoder passwordEncoder;
  private final UserGroupDao userGroupDao;
  private final UserGroupJoinRequestDao userGroupJoinRequestDao;
  private final ProjectDao projectDao;
  private final ProjectJoinRequestDao projectJoinRequestDao;
  private final TaskDao taskDao;
  private final QuestionnaireDao questionnaireDao;

  private final static String EXAMPLE_DATA_POPULATED_MESSAGE = "<code>\n" +
    "export default function QuestionnaireEditor(){\n" +
    "  const authJsonFetch = useAuthJsonFetch();\n" +
    "  const notification = useNotification();\n" +
    "  const navigate = useNavigate();\n" +
    "  const dialog = useDialog();\n" +
    "\n" +
    "  const {loading: permissionsLoading, projectPermissions} = usePermissions();\n" +
    "  const groupId = useParams()?.groupId;\n" +
    "  const projectId = useParams()?.projectId;\n" +
    "  const questionnaireId = useParams()?.questionnaireId;\n" +
    "  const isUpdatePage = !!isValidId(questionnaireId);\n" +
    "\n" +
    "  const [loading, setLoading] = useState<boolean>(isUpdatePage);\n" +
    "  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(true);\n" +
    "  const [name, setName] = useState<string | undefined>(undefined);\n" +
    "  const [description, setDescription] = useState<string | undefined>(undefined);\n" +
    "  const [status, setStatus] = useState<QuestionnaireStatus>(QuestionnaireStatus.INACTIVE);\n" +
    "\n" +
    "  const [questions, setQuestions] = useState<QuestionRequestDto[]>([getNewQuestion()]);\n" +
    "\n" +
    "  const handleUpdateQuestions = (updatedQuestions: QuestionRequestDto[]) => {\n" +
    "    setQuestions(updatedQuestions);\n" +
    "  }\n" +
    "\n" +
    "  async function loadQuestionnaire() {\n" +
    "    try {\n" +
    "      const response = await authJsonFetch({\n" +
    "        path: `groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}`\n" +
    "      });\n" +
    "      if (!response?.status || response.status > 399 || !response?.data) {\n" +
    "        handleError(response?.error ?? response?.message ?? \"Failed to load questionnaire\");\n" +
    "        navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`);\n" +
    "        return;\n" +
    "      }\n" +
    "      const questionnaire = response.data as QuestionnaireResponseEditorDetailsDto;\n" +
    "      setName(questionnaire.name);\n" +
    "      setDescription(questionnaire.description);\n" +
    "      setStatus(questionnaire.status);\n" +
    "      setQuestions(questionnaire.questions?.length\n" +
    "        ? questionnaire.questions.map(question => toQuestionRequestDto(question))\n" +
    "        : [getNewQuestion()]);\n" +
    "    } catch (e) {\n" +
    "      handleError(\"Failed to load questionnaire\");\n" +
    "      navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`);\n" +
    "    } finally {\n" +
    "      setLoading(false);\n" +
    "      setHasUnsavedChanges(false);\n" +
    "    }\n" +
    "  }\n" +
    "\n" +
    "  useEffect(() => {\n" +
    "    if (!isValidId(groupId) || !isValidId(projectId)) {\n" +
    "      handleError(\"Invalid group or project identifier\");\n" +
    "      navigate(\"/groups\");\n" +
    "      return;\n" +
    "    }\n" +
    "    if (isUpdatePage) {\n" +
    "      loadQuestionnaire().then();\n" +
    "    }\n" +
    "  }, [isUpdatePage, groupId, projectId, questionnaireId]);\n" +
    "export default function QuestionnaireEditor() {\n" +
    "  const authJsonFetch = useAuthJsonFetch();\n" +
    "  const notification = useNotification();\n" +
    "  const navigate = useNavigate();\n" +
    "  const dialog = useDialog();\n" +
    "\n" +
    "  const {loading: permissionsLoading, projectPermissions} = usePermissions();\n" +
    "  const groupId = useParams()?.groupId;\n" +
    "  const projectId = useParams()?.projectId;\n" +
    "  const questionnaireId = useParams()?.questionnaireId;\n" +
    "  const isUpdatePage = !!isValidId(questionnaireId);\n" +
    "\n" +
    "  const [loading, setLoading] = useState<boolean>(isUpdatePage);\n" +
    "</code>";

  @PostConstruct
  @Transactional(rollbackFor = Exception.class)
  public void populate() {
    List<ApplicationUser> testUsers = createApplicationUsers(5);
    UserGroup userGroup = new UserGroup(
      "Test group 1", "Test group 1 description",
      "<h1>Test group 1 detailed description</h1><p></p><h2>1. Table</h2><p></p><table style=\"width: 303px\"><colgroup><col style=\"width: 200px\"><col style=\"width: 67px\"><col style=\"width: 36px\"></colgroup><tbody><tr><th colspan=\"1\" rowspan=\"1\" colwidth=\"200\"><p>1</p></th><th colspan=\"1\" rowspan=\"1\" colwidth=\"67\"><p>2</p></th><th colspan=\"1\" rowspan=\"1\" colwidth=\"36\"><p>3</p></th></tr><tr><td colspan=\"1\" rowspan=\"1\" colwidth=\"200\"><p>asd</p></td><td colspan=\"1\" rowspan=\"1\" colwidth=\"67\"><p>asd</p></td><td colspan=\"1\" rowspan=\"1\" colwidth=\"36\"><p>a</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\" colwidth=\"200\"><p>asd</p></td><td colspan=\"1\" rowspan=\"1\" colwidth=\"67\"><p>asd</p></td><td colspan=\"1\" rowspan=\"1\" colwidth=\"36\"><p>a</p></td></tr></tbody></table><hr><p></p><h2>2. List</h2><p>asd</p><ol><li><p><mark data-color=\"#ff0000\" style=\"background-color: #ff0000; color: inherit\">asd</mark></p></li><li><p><mark data-color=\"#dcff00\" style=\"background-color: #dcff00; color: inherit\">asd</mark></p></li><li><p><mark data-color=\"#00ffcc\" style=\"background-color: #00ffcc; color: inherit\">asd</mark></p></li></ol><p>asd</p><ul><li><p><span style=\"color: #9dff00\">asd</span></p></li><li><p><span style=\"color: #a48a53\">asd</span></p></li><li><p><span style=\"color: #b80000\">asd</span></p></li></ul><p>asd</p><ul data-type=\"taskList\"><li data-checked=\"true\" data-type=\"taskItem\"><label><input type=\"checkbox\" checked=\"checked\"><span></span></label><div><p>asd</p></div></li><li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>asd</p></div></li><li data-checked=\"true\" data-type=\"taskItem\"><label><input type=\"checkbox\" checked=\"checked\"><span></span></label><div><p>asd</p></div></li></ul><hr><p></p><h2>3. Links</h2><ul><li><p><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://dnadas.net/media/documents/cv-daniel-nadas.pdf\">cv</a></p></li><li><p><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://github.com/DNadas98\">github</a></p></li></ul><hr><p></p><h2>4. Other headings</h2><h3>Heading 3</h3><h4>Heading 4</h4><h5>Heading 5</h5><hr><p></p><h2>5. Fonts</h2><p><span style=\"font-family: Arial, sans-serif; font-size: 16px\">asd Arial</span></p><p><span style=\"font-family: Calibri, sans-serif; font-size: 16px\">asd Calibri</span></p><p><span style=\"font-family: \\'Garamond\\', serif; font-size: 16px\">asd Garmond</span></p><p><span style=\"font-family: \\'Helvetica\\ Neue\\', Helvetica, Arial, sans-serif; font-size: 16px\">asd Helvetica</span></p><p><span style=\"font-family: \\'Times\\ New\\ Roman\\', serif; font-size: 16px\">asd Times</span></p><p><span style=\"font-family: Verdana, sans-serif; font-size: 16px\">asd Verdana</span></p>",
      testUsers.get(0));
    userGroup.addMember(testUsers.get(1));
    userGroup.addEditor(testUsers.get(1));
    userGroup.addMember(testUsers.get(2));
    userGroup.addMember(testUsers.get(3));
    userGroupDao.save(userGroup);
    userGroupJoinRequestDao.save(new UserGroupJoinRequest(userGroup, testUsers.get(4)));

    Project project = new Project("Test project 1", "Test project 1 description",
      "<h1>Test project 1 detailed description</h1><p></p><h2>1. Table</h2><p></p><table style=\"width: 303px\"><colgroup><col style=\"width: 200px\"><col style=\"width: 67px\"><col style=\"width: 36px\"></colgroup><tbody><tr><th colspan=\"1\" rowspan=\"1\" colwidth=\"200\"><p>1</p></th><th colspan=\"1\" rowspan=\"1\" colwidth=\"67\"><p>2</p></th><th colspan=\"1\" rowspan=\"1\" colwidth=\"36\"><p>3</p></th></tr><tr><td colspan=\"1\" rowspan=\"1\" colwidth=\"200\"><p>asd</p></td><td colspan=\"1\" rowspan=\"1\" colwidth=\"67\"><p>asd</p></td><td colspan=\"1\" rowspan=\"1\" colwidth=\"36\"><p>a</p></td></tr><tr><td colspan=\"1\" rowspan=\"1\" colwidth=\"200\"><p>asd</p></td><td colspan=\"1\" rowspan=\"1\" colwidth=\"67\"><p>asd</p></td><td colspan=\"1\" rowspan=\"1\" colwidth=\"36\"><p>a</p></td></tr></tbody></table><hr><p></p><h2>2. List</h2><p>asd</p><ol><li><p><mark data-color=\"#ff0000\" style=\"background-color: #ff0000; color: inherit\">asd</mark></p></li><li><p><mark data-color=\"#dcff00\" style=\"background-color: #dcff00; color: inherit\">asd</mark></p></li><li><p><mark data-color=\"#00ffcc\" style=\"background-color: #00ffcc; color: inherit\">asd</mark></p></li></ol><p>asd</p><ul><li><p><span style=\"color: #9dff00\">asd</span></p></li><li><p><span style=\"color: #a48a53\">asd</span></p></li><li><p><span style=\"color: #b80000\">asd</span></p></li></ul><p>asd</p><ul data-type=\"taskList\"><li data-checked=\"true\" data-type=\"taskItem\"><label><input type=\"checkbox\" checked=\"checked\"><span></span></label><div><p>asd</p></div></li><li data-checked=\"false\" data-type=\"taskItem\"><label><input type=\"checkbox\"><span></span></label><div><p>asd</p></div></li><li data-checked=\"true\" data-type=\"taskItem\"><label><input type=\"checkbox\" checked=\"checked\"><span></span></label><div><p>asd</p></div></li></ul><hr><p></p><h2>3. Links</h2><ul><li><p><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://dnadas.net/media/documents/cv-daniel-nadas.pdf\">cv</a></p></li><li><p><a target=\"_blank\" rel=\"noopener noreferrer nofollow\" href=\"https://github.com/DNadas98\">github</a></p></li></ul><hr><p></p><h2>4. Other headings</h2><h3>Heading 3</h3><h4>Heading 4</h4><h5>Heading 5</h5><hr><p></p><h2>5. Fonts</h2><p><span style=\"font-family: Arial, sans-serif; font-size: 16px\">asd Arial</span></p><p><span style=\"font-family: Calibri, sans-serif; font-size: 16px\">asd Calibri</span></p><p><span style=\"font-family: \\'Garamond\\', serif; font-size: 16px\">asd Garmond</span></p><p><span style=\"font-family: \\'Helvetica\\ Neue\\', Helvetica, Arial, sans-serif; font-size: 16px\">asd Helvetica</span></p><p><span style=\"font-family: \\'Times\\ New\\ Roman\\', serif; font-size: 16px\">asd Times</span></p><p><span style=\"font-family: Verdana, sans-serif; font-size: 16px\">asd Verdana</span></p>",
      Instant.now(), Instant.now().plusSeconds(60 * 60), testUsers.get(0), userGroup);
    project.assignMember(testUsers.get(1));
    project.addEditor(testUsers.get(1));
    project.assignMember(testUsers.get(2));
    projectDao.save(project);
    projectJoinRequestDao.save(new ProjectJoinRequest(project, testUsers.get(3)));

    Task task = new Task("Test task 1", "Test task 1 description", Importance.NICE_TO_HAVE, 3,
      Instant.now(), Instant.now().plusSeconds(60 * 60), TaskStatus.IN_PROGRESS, project,
      testUsers.get(0));
    task.assignMember(testUsers.get(1));
    task.assignMember(testUsers.get(2));
    taskDao.save(task);

    Questionnaire questionnaire =
      createQuestionnaire(project, testUsers);
    questionnaire.setStatus(QuestionnaireStatus.ACTIVE);
    questionnaireDao.save(questionnaire);

    log.info("Database has been populated with example data successfully");
  }

  private Questionnaire createQuestionnaire(Project project, List<ApplicationUser> testUsers) {
    Questionnaire questionnaire = new Questionnaire("Test questionnaire 1",
      EXAMPLE_DATA_POPULATED_MESSAGE,
      project, testUsers.get(0));
    for (int i = 0; i < 30; i++) {
      Question question = new Question(
        EXAMPLE_DATA_POPULATED_MESSAGE, QuestionType.RADIO, 1, 1, questionnaire);
      Answer answer1 = new Answer("Test answer " + i + " - 1", true, 1, question);
      question.addAnswer(answer1);
      Answer answer2 = new Answer("Test answer " + i + " - 2", false, 2, question);
      question.addAnswer(answer2);
      Answer answer3 = new Answer("Test answer " + i + " - 3", false, 3, question);
      question.addAnswer(answer3);
      questionnaire.addQuestion(question);
    }
    return questionnaire;
  }

  private List<ApplicationUser> createApplicationUsers(int i) {
    List<ApplicationUser> users = new ArrayList<>();
    for (int j = 1; j <= i; j++) {
      ApplicationUser applicationUser = applicationUserDao.save(
        new ApplicationUser("Dev User " + j, "user" + j + "@test.test",
          passwordEncoder.encode("devuser" + j + "password")));
      users.add(applicationUser);
    }
    return users;
  }
}
