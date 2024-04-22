import {useEffect, useMemo, useState} from "react";
import LoadingSpinner from "../../../../../common/utils/components/LoadingSpinner.tsx";
import {useNavigate} from "react-router-dom";
import {useNotification} from "../../../../../common/notification/context/NotificationProvider.tsx";
import UserQuestionnaireBrowser from "./UserQuestionnaireBrowser.tsx";
import {QuestionnaireResponseDto} from "../../../../../questionnaires/dto/QuestionnaireResponseDto.ts";
import {isValidId} from "../../../../../common/utils/isValidId.ts";
import useAuthJsonFetch from "../../../../../common/api/hooks/useAuthJsonFetch.tsx";

interface UserQuestionnairesProps {
  groupId: string | undefined,
  projectId: string | undefined
}

export default function UserQuestionnaires({groupId, projectId}: UserQuestionnairesProps) {
  const [questionnairesLoading, setQuestionnairesLoading] = useState<boolean>(true);
  const [maxPointQuestionnairesLoading, setMaxPointQuestionnairesLoading] = useState<boolean>(true);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireResponseDto[]>([]);
  const [maxPointQuestionnaires, setMaxPointQuestionnaires] = useState<QuestionnaireResponseDto[]>([]);
  const authJsonFetch = useAuthJsonFetch();
  const navigate = useNavigate();
  const notification = useNotification();

  const loadQuestionnaires = async () => {
    try {
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setQuestionnaires([]);
        return;
      }
      setQuestionnairesLoading(true);
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/questionnaires?maxPoints=false`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to load questionnaires"}`
        });
        setQuestionnaires([]);
        return;
      }
      setQuestionnaires(response.data as QuestionnaireResponseDto[]);
    } catch (e) {
      setQuestionnaires([]);
    } finally {
      setQuestionnairesLoading(false);
    }
  };

  const loadMaxPointQuestionnaires = async () => {
    try {
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setMaxPointQuestionnaires([]);
        return;
      }
      setMaxPointQuestionnairesLoading(true);
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/questionnaires?maxPoints=true`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to load questionnaires"}`
        });
        setMaxPointQuestionnaires([]);
        return;
      }
      setMaxPointQuestionnaires(response.data as QuestionnaireResponseDto[]);
    } catch (e) {
      setMaxPointQuestionnaires([]);
    } finally {
      setMaxPointQuestionnairesLoading(false);
    }
  };

  useEffect(() => {
    loadQuestionnaires();
    loadMaxPointQuestionnaires();
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
  }

  const [maxPointQuestionnairesFilterValue, setMaxPointQuestionnairesFilterValue] = useState<string>("");

  const maxPointQuestionnairesFiltered = useMemo(() => {
    return maxPointQuestionnaires.filter(questionnaire => {
        return questionnaire.name.toLowerCase().includes(maxPointQuestionnairesFilterValue);
      }
    );
  }, [maxPointQuestionnaires, maxPointQuestionnairesFilterValue]);

  const handleMaxPointQuestionnaireSearch = (event: any) => {
    setMaxPointQuestionnairesFilterValue(event.target.value.toLowerCase().trim());
  }

  const handleFillOutClick = (id: number) => {
    navigate(`/groups/${groupId}/projects/${projectId}/questionnaires/${id}`);
  }

  const handlePastSubmissionsClick = (id: number) => {
    navigate(`/groups/${groupId}/projects/${projectId}/questionnaires/${id}/submissions`);
  }

  if (questionnairesLoading || maxPointQuestionnairesLoading) {
    return <LoadingSpinner/>;
  }

  return (
    <UserQuestionnaireBrowser questionnairesLoading={questionnairesLoading}
                              maxPointQuestionnairesLoading={maxPointQuestionnairesLoading}
                              questionnaires={questionnairesFiltered}
                              maxPointQuestionnaires={maxPointQuestionnairesFiltered}
                              handleQuestionnaireSearch={handleQuestionnairesSearch}
                              handleMaxPointQuestionnaireSearch={handleMaxPointQuestionnaireSearch}
                              handleFillOutClick={handleFillOutClick}
                              handlePastSubmissionsClick={handlePastSubmissionsClick}
                              handleBackClick={() => navigate(`/groups/${groupId}/projects/${projectId}`)}
    />
  );
}
