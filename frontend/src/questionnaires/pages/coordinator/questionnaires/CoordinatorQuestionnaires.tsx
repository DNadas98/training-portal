import {useEffect, useMemo, useState} from "react";
import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../../authentication/hooks/usePermissions.ts";
import {useNavigate, useParams} from "react-router-dom";
import {PermissionType} from "../../../../authentication/dto/PermissionType.ts";
import {useNotification} from "../../../../common/notification/context/NotificationProvider.tsx";
import {QuestionnaireResponseEditorDto} from "../../../dto/QuestionnaireResponseEditorDto.ts";
import {isValidId} from "../../../../common/utils/isValidId.ts";
import useAuthJsonFetch from "../../../../common/api/hooks/useAuthJsonFetch.tsx";
import CoordinatorQuestionnaireBrowser from "./components/CoordinatorQuestionnaireBrowser.tsx";

export default function CoordinatorQuestionnaires() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const [loading, setLoading] = useState<boolean>(true);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireResponseEditorDto[]>([]);
  const authJsonFetch = useAuthJsonFetch();
  const navigate = useNavigate();
  const notification = useNotification();

  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;

  const loadQuestionnaires = async () => {
    try {
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setQuestionnaires([]);
        return;
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/coordinator/questionnaires`
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

  const handleStatisticClick = (questionnaireId: number) => {
    navigate(`/groups/${groupId}/projects/${projectId}/coordinator/questionnaires/${questionnaireId}/statistics`);
  };

  const handleBackClick = () => {
    navigate(`/groups/${groupId}/projects/${projectId}`);
  };

  if (loading || permissionsLoading) {
    return <LoadingSpinner/>;
  } else if (!projectPermissions.includes(PermissionType.PROJECT_COORDINATOR)) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: "Access Denied: Insufficient permissions"
    });
    navigate(`/groups/${groupId}/projects/${projectId}`);
    return <></>;
  }

  return (
    <CoordinatorQuestionnaireBrowser questionnairesLoading={loading}
                                     questionnaires={questionnairesFiltered}
                                     handleQuestionnaireSearch={handleQuestionnairesSearch}
                                     handleStatisticClick={handleStatisticClick}
    handleBackClick={handleBackClick}/>
  );
}
