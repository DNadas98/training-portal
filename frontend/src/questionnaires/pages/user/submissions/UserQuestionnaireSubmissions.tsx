import {useEffect, useMemo, useState} from "react";
import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../../authentication/hooks/usePermissions.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useNotification} from "../../../../common/notification/context/NotificationProvider.tsx";
import {isValidId} from "../../../../common/utils/isValidId.ts";
import UserQuestionnaireSubmissionBrowser from "./components/UserQuestionnaireSubmissionBrowser.tsx";
import {QuestionnaireSubmissionResponseDto} from "../../../dto/QuestionnaireSubmissionResponseDto.ts";
import useAuthJsonFetch from "../../../../common/api/hooks/useAuthJsonFetch.tsx";

export default function UserQuestionnaireSubmissions() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const [questionnaireSubmissionsLoading, setQuestionnaireSubmissionsLoading] = useState<boolean>(true);
  const [maxPointQuestionnaireSubmissionsLoading, setMaxPointQuestionnaireSubmissionsLoading] = useState<boolean>(true);
  const [questionnaireSubmissions, setQuestionnaireSubmissions] = useState<QuestionnaireSubmissionResponseDto[]>([]);
  const [maxPointQuestionnaireSubmission, setMaxPointQuestionnaireSubmission] = useState<QuestionnaireSubmissionResponseDto | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const navigate = useNavigate();
  const notification = useNotification();

  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const questionnaireId = useParams()?.questionnaireId;

  const loadQuestionnaireSubmissions = async () => {
    try {
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setQuestionnaireSubmissions([]);
        return;
      }
      setQuestionnaireSubmissionsLoading(true);
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/questionnaires/${questionnaireId}/submissions`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to load questionnaire submissions"}`
        });
        setQuestionnaireSubmissions([]);
        return;
      }
      setQuestionnaireSubmissions(response.data as QuestionnaireSubmissionResponseDto[]);
    } catch (e) {
      setQuestionnaireSubmissions([]);
    } finally {
      setQuestionnaireSubmissionsLoading(false);
    }
  };

  const loadMaxPointQuestionnaires = async () => {
    try {
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setMaxPointQuestionnaireSubmission(undefined);
        return;
      }
      setMaxPointQuestionnaireSubmissionsLoading(true);
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/questionnaires/${questionnaireId}/submissions/maxPoints`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        setMaxPointQuestionnaireSubmission(undefined);
        return;
      }
      setMaxPointQuestionnaireSubmission(response.data as QuestionnaireSubmissionResponseDto);
    } catch (e) {
      setMaxPointQuestionnaireSubmission(undefined);
    } finally {
      setMaxPointQuestionnaireSubmissionsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestionnaireSubmissions();
    loadMaxPointQuestionnaires();
  }, [groupId, projectId]);

  const [questionnaireSubmissionsFilterValue, setQuestionnaireSubmissionsFilterValue] = useState<string>("");

  const questionnaireSubmissionsFiltered = useMemo(() => {
    return questionnaireSubmissions.filter(submission => {
        return submission.name.toLowerCase().includes(questionnaireSubmissionsFilterValue);
      }
    );
  }, [questionnaireSubmissions, questionnaireSubmissionsFilterValue]);

  const handleQuestionnaireSubmissionsSearch = (event: any) => {
    setQuestionnaireSubmissionsFilterValue(event.target.value.toLowerCase().trim());
  }

  if (permissionsLoading || questionnaireSubmissionsLoading || maxPointQuestionnaireSubmissionsLoading) {
    return <LoadingSpinner/>;
  } else if (!projectPermissions.length) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: "Access Denied: Insufficient permissions"
    });
    navigate(`/groups/${groupId}/projects`);
    return <></>;
  }

  return (
    <UserQuestionnaireSubmissionBrowser
      questionnaireSubmissions={questionnaireSubmissionsFiltered}
      maxPointQuestionnaireSubmission={maxPointQuestionnaireSubmission}
      handleQuestionnaireSubmissionsSearch={handleQuestionnaireSubmissionsSearch}
    />
  );
}
