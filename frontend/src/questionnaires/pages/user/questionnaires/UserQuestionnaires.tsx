import {useEffect, useMemo, useState} from "react";
import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../../authentication/hooks/usePermissions.ts";
import {useAuthJsonFetch} from "../../../../common/api/service/apiService.ts";
import {useNavigate, useParams} from "react-router-dom";
import {
  useNotification
} from "../../../../common/notification/context/NotificationProvider.tsx";
import UserQuestionnaireBrowser from "./components/UserQuestionnaireBrowser.tsx";
import {QuestionnaireResponseDto} from "../../../dto/QuestionnaireResponseDto.ts";
import {isValidId} from "../../../../common/utils/isValidId.ts";

export default function UserQuestionnaires() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const [loading, setLoading] = useState<boolean>(true);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireResponseDto[]>([]);
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
        path: `groups/${groupId}/projects/${projectId}/questionnaires`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to load questionnaires"}`
        });
        return;
      }
      setQuestionnaires(response.data as QuestionnaireResponseDto[]);
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

  if (loading || permissionsLoading) {
    return <LoadingSpinner/>;
  } else if (!projectPermissions.length) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: "Access Denied: Insufficient permissions"
    });
    navigate(`/groups/${groupId}/projects/${projectId}`);
    return <></>;
  }

  return (
    <UserQuestionnaireBrowser questionnairesLoading={loading}
                              questionnaires={questionnairesFiltered}
                              handleQuestionnaireSearch={handleQuestionnairesSearch}
    />
  );
}
