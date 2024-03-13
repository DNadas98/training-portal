import {useEffect, useState} from "react";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {
  QuestionnaireResponseEditorDto
} from "../../dto/QuestionnaireResponseEditorDto.ts";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {useNavigate, useParams} from "react-router-dom";
import {
  PermissionType
} from "../../../authentication/dto/applicationUser/PermissionType.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import {QuestionType} from "../../dto/QuestionType.ts";

export default function Questionnaires() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const [loading, setLoading] = useState<boolean>(true);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireResponseEditorDto[]>([]);
  const authJsonFetch = useAuthJsonFetch();
  const navigate = useNavigate();
  const notification = useNotification();

  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;

  function idIsValid(id: string | undefined) {
    return id && !isNaN(parseInt(id)) && parseInt(id) > 0;
  }

  async function loadQuestionnaires() {
    try {
      if (!idIsValid(groupId) || !idIsValid(projectId)) {
        setQuestionnaires([]);
        return;
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/questionnaires`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to load questionnaires"}`
        });
        return;
      }
      setQuestionnaires(response.data as QuestionnaireResponseEditorDto[]);
    } catch (e) {
      setQuestionnaires([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuestionnaires().then();
  }, []);

  function handleAddQuestionnaireClick() {
    navigate(`/groups/${groupId}/projects/${projectId}/questionnaires/create`);
  }

  async function handleDeleteClick(questionnaireId: number) {
    try {
      setLoading(true);
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/questionnaires/${questionnaireId}`,
        method: "DELETE"
      });
      if (!response?.status || response.status > 399) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to delete questionnaire"}`
        });
        return;
      }
      await loadQuestionnaires();
    } catch (e) {
      notification.openNotification({
        type: "error", vertical: "top", horizontal: "center",
        message: "Failed to delete questionnaire"
      });
    } finally {
      setLoading(false);
    }
  }

  if (loading || permissionsLoading) {
    return <LoadingSpinner/>;
  } else if (!projectPermissions.includes(PermissionType.PROJECT_EDITOR)) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: "Access Denied: Insufficient permissions"
    });
    navigate(`/groups/${groupId}/projects/${projectId}`);
    return <></>;
  }

  return loading ? <LoadingSpinner/> : (
    <div>
      <h1>Questionnaires</h1>
      <button onClick={() => {
        handleAddQuestionnaireClick();
      }}>Add new questionnaire
      </button>
      <ul>{
        questionnaires.map((questionnaire) => {
          return <li key={questionnaire.id}>
            <div>
              <h2>{questionnaire.name}</h2>
              <p>{questionnaire.description}</p>
              {questionnaire.questions.map((question) => {
                return <ul key={question.id}>
                  <h3>{`${question.order}. ${question.text}`}</h3>
                  <p>Max points: {question.points}</p>
                  <ul>{
                    question.answers.map((answer) => {
                      return <li key={answer.id}>
                        <span>{answer.order}. {answer.text}</span>
                        <input
                          type={question.type === QuestionType.RADIO ? "radio" : "checkbox"}
                          name={question.id.toString()}
                          checked={answer.correct}/>
                      </li>;
                    })
                  }</ul>
                </ul>;
              })}
              <button onClick={() => {
                handleDeleteClick(questionnaire.id);
              }}>Delete
              </button>
            </div>
          </li>;
        })
      }</ul>
    </div>
  );
}
