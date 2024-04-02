import {useEffect, useState} from "react";
import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../../authentication/hooks/usePermissions.ts";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useNotification} from "../../../../common/notification/context/NotificationProvider.tsx";
import {isValidId} from "../../../../common/utils/isValidId.ts";
import UserQuestionnaireSubmissionBrowser from "./components/UserQuestionnaireSubmissionBrowser.tsx";
import {QuestionnaireSubmissionResponseDto} from "../../../dto/QuestionnaireSubmissionResponseDto.ts";
import useAuthJsonFetch from "../../../../common/api/hooks/useAuthJsonFetch.tsx";
import {ApiResponsePageableDto} from "../../../../common/api/dto/ApiResponsePageableDto.ts";
import {useDialog} from "../../../../common/dialog/context/DialogProvider.tsx";

export default function UserQuestionnaireSubmissions() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const [questionnaireSubmissionsLoading, setQuestionnaireSubmissionsLoading] = useState<boolean>(true);
  const [maxPointQuestionnaireSubmissionsLoading, setMaxPointQuestionnaireSubmissionsLoading] = useState<boolean>(true);
  const [questionnaireSubmissions, setQuestionnaireSubmissions] = useState<QuestionnaireSubmissionResponseDto[]>([]);
  const [maxPointQuestionnaireSubmission, setMaxPointQuestionnaireSubmission] = useState<QuestionnaireSubmissionResponseDto | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const navigate = useNavigate();
  const notification = useNotification();
  const dialog = useDialog();

  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const questionnaireId = useParams()?.questionnaireId;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [totalPages, setTotalPages] = useState(1);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const size = parseInt(searchParams.get('size') || '10', 10);

  const loadQuestionnaireSubmissions = async () => {
    try {
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setQuestionnaireSubmissions([]);
        return;
      }
      setQuestionnaireSubmissionsLoading(true);
      const response = await authJsonFetch({
        path:
          `groups/${groupId}/projects/${projectId}/questionnaires/${questionnaireId}/submissions?page=${page}&size=${size}`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to load questionnaire submissions"}`
        });
        setQuestionnaireSubmissions([]);
        return;
      }
      const pageableResponse= response as unknown as ApiResponsePageableDto;
      setQuestionnaireSubmissions(pageableResponse.data as QuestionnaireSubmissionResponseDto[]);
      const totalPageCount=Number(pageableResponse.totalPages);
      if (!isNaN(totalPageCount))
      setTotalPages(totalPageCount);
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
    loadMaxPointQuestionnaires();
  }, [groupId, projectId]);

  useEffect(() => {
    loadQuestionnaireSubmissions();
    console.log(page,size)
  }, [groupId, projectId, page, size]);

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

  async function deleteSubmission(submissionId: number) {
    try {
      setQuestionnaireSubmissionsLoading(true);
      const response = await authJsonFetch({
        path:
          `groups/${groupId}/projects/${projectId}/questionnaires/${questionnaireId}/submissions/${submissionId}`,
        method: "DELETE"
      });
      if (!response?.status || response.status > 399 || !response?.message) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to delete questionnaire submission"}`
        });
        return;
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center", message: response.message
      });
      await loadQuestionnaireSubmissions();
    } catch (e) {
      notification.openNotification({
        type: "error", vertical: "top", horizontal: "center",
        message: "Failed to delete questionnaire submission"
      });
      return;
    } finally {
      setQuestionnaireSubmissionsLoading(false);
    }
  }

  const handleDeleteClick = (submissionId: number) => {
    dialog.openDialog({
      text: "Are you sure, you would like to delete this questionnaire submission?",
      onConfirm: () => deleteSubmission(submissionId)
    });
  }

  return (
    <UserQuestionnaireSubmissionBrowser
      questionnaireSubmissions={questionnaireSubmissions}
      maxPointQuestionnaireSubmission={maxPointQuestionnaireSubmission}
      totalPages={totalPages}
      page={page} size={size}
      onDeleteClick={handleDeleteClick}/>
  );
}
