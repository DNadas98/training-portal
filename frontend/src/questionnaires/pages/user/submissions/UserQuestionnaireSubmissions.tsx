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
import QuestionnaireSubmissionDetails from "./components/QuestionnaireSubmissionDetails.tsx";
import {QuestionnaireSubmissionResponseDetailsDto} from "../../../dto/QuestionnaireSubmissionResponseDetailsDto.ts";

export default function UserQuestionnaireSubmissions() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const [questionnaireSubmissionsLoading, setQuestionnaireSubmissionsLoading] = useState<boolean>(true);
  const [maxPointQuestionnaireSubmissionsLoading, setMaxPointQuestionnaireSubmissionsLoading] = useState<boolean>(true);
  const [questionnaireSubmissions, setQuestionnaireSubmissions] = useState<QuestionnaireSubmissionResponseDto[]>([]);
  const [maxPointQuestionnaireSubmission, setMaxPointQuestionnaireSubmission] = useState<QuestionnaireSubmissionResponseDto | undefined>(undefined);
  const [selectedQuestionnaireSubmissionLoading, setSelectedQuestionnaireSubmissionLoading] = useState<boolean>(false);
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
  const page = searchParams.get('page') || '1';
  const size = searchParams.get('size') || '10';

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
      const pageableResponse = response as unknown as ApiResponsePageableDto;
      setQuestionnaireSubmissions(pageableResponse.data as QuestionnaireSubmissionResponseDto[]);
      const totalPageCount = Number(pageableResponse.totalPages);
      if (!isNaN(totalPageCount))
        setTotalPages(totalPageCount);
    } catch (e) {
      setQuestionnaireSubmissions([]);
    } finally {
      setQuestionnaireSubmissionsLoading(false);
    }
  };

  const loadMaxPointQuestionnaire = async () => {
    try {
      if (!isValidId(groupId) || !isValidId(projectId) || !isValidId(questionnaireId)) {
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

  const handleQuestionnaireSubmissionSelect = async (id: number) => {
    try {
      if (!isValidId(groupId) || !isValidId(projectId) || !isValidId(questionnaireId)) {
        return;
      }
      setSelectedQuestionnaireSubmissionLoading(true);
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/questionnaires/${questionnaireId}/submissions/${id}`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center", message:
            response?.error ?? "Failed to load selected questionnaire submission"
        });
        return;
      }
      dialog.openDialog({
        content: <QuestionnaireSubmissionDetails
          submission={response.data as QuestionnaireSubmissionResponseDetailsDto}/>,
        onConfirm: () => {
        }, confirmText: "Close", oneActionOnly: true, blockScreen: true
      });
    } catch (e) {
      notification.openNotification({
        type: "error", vertical: "top", horizontal: "center", message:
          "Failed to load selected questionnaire submission"
      });
    } finally {
      setSelectedQuestionnaireSubmissionLoading(false);
    }
  }

  useEffect(() => {
    loadMaxPointQuestionnaire();
  }, [groupId, projectId]);

  useEffect(() => {
    loadQuestionnaireSubmissions();
  }, [groupId, projectId, page, size]);


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
      searchParams.set("page", "1");
      navigate({search: searchParams.toString()});
      loadQuestionnaireSubmissions();
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
      content: "Are you sure, you would like to delete this questionnaire submission?",
      onConfirm: () => deleteSubmission(submissionId)
    });
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
      questionnaireSubmissions={questionnaireSubmissions}
      onQuestionnaireSubmissionSelectClick={handleQuestionnaireSubmissionSelect}
      selectedQuestionnaireSubmissionLoading={selectedQuestionnaireSubmissionLoading}
      maxPointQuestionnaireSubmission={maxPointQuestionnaireSubmission}
      totalPages={totalPages}
      page={page} size={size}
      onDeleteClick={handleDeleteClick}
      handleBackClick={() => navigate(`/groups/${groupId}/projects/${projectId}`)}/>
  );
}
