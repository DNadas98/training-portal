import {useEffect, useMemo, useState} from "react";
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
import QuestionnaireBrowser from "./components/QuestionnaireBrowser.tsx";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";

export default function Questionnaires() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const [loading, setLoading] = useState<boolean>(true);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireResponseEditorDto[]>([]);
  const authJsonFetch = useAuthJsonFetch();
  const navigate = useNavigate();
  const notification = useNotification();
  const dialog = useDialog();

  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;

  function idIsValid(id: string | undefined) {
    return id && !isNaN(parseInt(id)) && parseInt(id) > 0;
  }

  const loadQuestionnaires = async () => {
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
  };

  useEffect(() => {
    loadQuestionnaires().then();
  }, []);

  const handleAddQuestionnaire = () => {
    navigate(`/groups/${groupId}/projects/${projectId}/questionnaires/create`);
  };

  const handleEditQuestionnaire = (questionnaireId: number) => {
    navigate(`/groups/${groupId}/projects/${projectId}/questionnaires/${questionnaireId}/update`);
  };

  const [questionnairesFilterValue, setQuestionnairesFilterValue] = useState<string>("");

  const questionnairesFiltered = useMemo(() => {
    return questionnaires.filter(project => {
        return project.name.toLowerCase().includes(questionnairesFilterValue);
      }
    );
  }, [questionnaires, questionnairesFilterValue]);

  const handleQuestionnairesSearch = (event: any) => {
    setQuestionnairesFilterValue(event.target.value.toLowerCase().trim());
  };

  const deleteQuestionnaire = async (questionnaireId: number) => {
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
  };

  const handleDeleteClick = (questionnaireId: number) => {
    dialog.openDialog({
      text: "Do you really wish to remove the selected questionnaire?",
      confirmText: "Yes, delete this questionnaire", onConfirm: () => {
        deleteQuestionnaire(questionnaireId);
      }
    });
  };

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

  return (
    <QuestionnaireBrowser questionnairesLoading={loading}
                          questionnaires={questionnairesFiltered}
                          handleQuestionnaireSearch={handleQuestionnairesSearch}
                          onAddClick={handleAddQuestionnaire}
                          onEditClick={handleEditQuestionnaire}
                          onDeleteClick={handleDeleteClick}
    />
  );
}
