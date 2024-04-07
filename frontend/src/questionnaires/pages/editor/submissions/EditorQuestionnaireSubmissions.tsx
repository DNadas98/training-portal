import {useEffect, useState} from "react";
import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../../authentication/hooks/usePermissions.ts";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useNotification} from "../../../../common/notification/context/NotificationProvider.tsx";
import {isValidId} from "../../../../common/utils/isValidId.ts";
import {PermissionType} from "../../../../authentication/dto/PermissionType.ts";
import {Button, Card, CardActions, CardContent, CardHeader, Grid, Stack, Typography} from "@mui/material";
import {useDialog} from "../../../../common/dialog/context/DialogProvider.tsx";
import useAuthJsonFetch from "../../../../common/api/hooks/useAuthJsonFetch.tsx";
import {QuestionnaireSubmissionResponseEditorDto} from "../../../dto/QuestionnaireSubmissionResponseEditorDto.ts";
import {QuestionnaireResponseDto} from "../../../dto/QuestionnaireResponseDto.ts";
import URLQueryPagination from "../../../../common/pagination/URLQueryPagination.tsx";
import {ApiResponsePageableDto} from "../../../../common/api/dto/ApiResponsePageableDto.ts";
import UserQuestionnaireSubmissionList from "../../user/submissions/components/UserQuestionnaireSubmissionList.tsx";
import QuestionnaireSubmissionDetails from "../../user/submissions/components/QuestionnaireSubmissionDetails.tsx";
import {QuestionnaireSubmissionResponseDetailsDto} from "../../../dto/QuestionnaireSubmissionResponseDetailsDto.ts";

export default function EditorQuestionnaireSubmissions() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const [questionnaireSubmissionsLoading, setQuestionnaireSubmissionsLoading] = useState<boolean>(true);
  const [questionnaireSubmissions, setQuestionnaireSubmissions] = useState<QuestionnaireSubmissionResponseEditorDto[]>([]);
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireResponseDto | undefined>(undefined);
  const [questionnaireLoading, setQuestionnaireLoading] = useState<boolean>(true);
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
  const [totalPages, setTotalPages] = useState(0);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const size = parseInt(searchParams.get('size') || '10', 10);

  const loadQuestionnaireSubmissions = async () => {
    try {
      if (!isValidId(groupId) || !isValidId(projectId) || !isValidId(questionnaireId)) {
        setQuestionnaireSubmissions([]);
        return;
      }
      setQuestionnaireSubmissionsLoading(true);
      const response = await authJsonFetch({
        path:
          `groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}/submissions?page=${page}&size=${size}`
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
      setQuestionnaireSubmissions(pageableResponse.data as QuestionnaireSubmissionResponseEditorDto[]);
      setTotalPages(Number(pageableResponse.totalPages));
    } catch (e) {
      setQuestionnaireSubmissions([]);
    } finally {
      setQuestionnaireSubmissionsLoading(false);
    }
  };

  const loadQuestionnaire = async () => {
    try {
      if (!isValidId(groupId) || !isValidId(projectId) || !isValidId(questionnaireId)) {
        setQuestionnaire(undefined);
        return;
      }
      setQuestionnaireLoading(true);
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to load questionnaire submissions"}`
        });
        setQuestionnaire(undefined);
        return;
      }
      setQuestionnaire(response.data as QuestionnaireResponseDto);
    } catch (e) {
      setQuestionnaire(undefined);
    } finally {
      setQuestionnaireLoading(false);
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
    loadQuestionnaire();
  }, [groupId, projectId]);

  useEffect(() => {
    loadQuestionnaireSubmissions();
  }, [groupId, projectId, page, size]);

  const deleteSubmission = async (submissionId: number) => {
    try {
      setQuestionnaireSubmissionsLoading(true);
      const response = await authJsonFetch({
        path:
          `groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}/submissions/${submissionId}`,
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

  if (permissionsLoading || questionnaireLoading || questionnaireSubmissionsLoading) {
    return <LoadingSpinner/>;
  } else if (!projectPermissions.includes(PermissionType.PROJECT_EDITOR)) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: "Access Denied: Insufficient permissions"
    });
    navigate(`/groups/${groupId}/projects`);
    return <></>;
  } else if (!questionnaire) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: "Failed to load questionnaire data"
    });
    navigate(`/groups/${groupId}/projects`);
    return <></>;
  }

  function handleBackClick(): void {
        navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`)
    }

  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={10} sm={10} md={9} lg={8}><Stack spacing={2}><Card>
        <CardContent>
          <Grid container spacing={1} justifyContent={"space-between"} alignItems={"baseline"}>
            <Grid item xs={12} md={true}>
              <Typography variant={"h5"}>
                {questionnaire.name}
              </Typography>
            </Grid>
            {questionnaireSubmissions?.length ? <Grid item xs={12} md={"auto"}>
              <URLQueryPagination totalPages={totalPages}/>
            </Grid> : <></>}
          </Grid>
        </CardContent>
      </Card>
        {questionnaireSubmissions?.length
          ?
          <UserQuestionnaireSubmissionList questionnaireSubmissions={questionnaireSubmissions}
                                             maxPoints={false}
                                             onDeleteClick={handleDeleteClick}
           onSelectClick={handleQuestionnaireSubmissionSelect}
           selectedQuestionnaireSubmissionLoading={selectedQuestionnaireSubmissionLoading}/>
          : <Card>
            <CardHeader title={"No submissions were found for this questionnaire."}
                        sx={{textAlign: "center"}}/>
          </Card>}
        <Card><CardActions>
          <Button sx={{width: "fit-content"}} onClick={handleBackClick}>
            Back To Questionnaires
          </Button>
        </CardActions></Card>
      </Stack>
      </Grid>
    </Grid>
  )
    ;
}
