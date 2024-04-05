import {useEffect, useMemo, useState} from "react";
import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../../authentication/hooks/usePermissions.ts";
import {useNavigate, useParams} from "react-router-dom";
import {PermissionType} from "../../../../authentication/dto/PermissionType.ts";
import {useNotification} from "../../../../common/notification/context/NotificationProvider.tsx";
import QuestionnaireBrowser from "./components/QuestionnaireBrowser.tsx";
import {useDialog} from "../../../../common/dialog/context/DialogProvider.tsx";
import {QuestionnaireResponseEditorDto} from "../../../dto/QuestionnaireResponseEditorDto.ts";
import {isValidId} from "../../../../common/utils/isValidId.ts";
import useAuthJsonFetch from "../../../../common/api/hooks/useAuthJsonFetch.tsx";

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

  const loadQuestionnaires = async () => {
    try {
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setQuestionnaires([]);
        return;
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/editor/questionnaires`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to load questionnaires"}`
        });
        return;
      }
      const questionnairesWithDates: QuestionnaireResponseEditorDto[] = response.data.map((questionnaire: any) => {
        return {
          ...questionnaire,
          createdAt: new Date(questionnaire.createdAt),
          updatedAt: new Date(questionnaire.updatedAt)
        };
      });
      setQuestionnaires(questionnairesWithDates);
    } catch (e) {
      setQuestionnaires([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestionnaires().then();
  }, [groupId, projectId]);

  const handleAddQuestionnaire = () => {
    navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires/create`);
  };

  const handleEditQuestionnaire = (questionnaireId: number) => {
    navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}/update`);
  };

  const handleTestQuestionnaire = (questionnaireId: number) => {
    navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}/tests/new`);
  };

  const handleViewTests = (questionnaireId: number) => {
    navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}/tests`);
  };
  const [questionnairesFilterValue, setQuestionnairesFilterValue] = useState<string>("");

  const questionnairesFiltered = useMemo(() => {
    return questionnaires.filter(questionnaire => {
        return questionnaire.name.toLowerCase().includes(questionnairesFilterValue);
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
        path: `groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}`,
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
      content: "Do you really wish to remove the selected questionnaire?",
      confirmText: "Yes, delete this questionnaire", onConfirm: () => {
        deleteQuestionnaire(questionnaireId);
      }
    });
  };

  const handleStatisticClick = (questionnaireId: number) => {
    navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}/statistics`);
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
                          onTestClick={handleTestQuestionnaire}
                          onEditClick={handleEditQuestionnaire}
                          onDeleteClick={handleDeleteClick}
                          onViewTestsClick={handleViewTests}
                          handleStatisticClick={handleStatisticClick}
                          isAdmin={projectPermissions.includes(PermissionType.PROJECT_ADMIN)}/>
  );
}
