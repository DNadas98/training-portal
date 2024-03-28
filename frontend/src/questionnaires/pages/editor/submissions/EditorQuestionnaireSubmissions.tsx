import {useEffect, useMemo, useState} from "react";
import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../../authentication/hooks/usePermissions.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useNotification} from "../../../../common/notification/context/NotificationProvider.tsx";
import {isValidId} from "../../../../common/utils/isValidId.ts";
import {QuestionnaireSubmissionResponseDto} from "../../../dto/QuestionnaireSubmissionResponseDto.ts";
import {PermissionType} from "../../../../authentication/dto/PermissionType.ts";
import {Card, CardContent, CardHeader, Grid, Stack, TextField} from "@mui/material";
import EditorQuestionnaireSubmissionList from "./components/EditorQuestionnaireSubmissionList.tsx";
import {useDialog} from "../../../../common/dialog/context/DialogProvider.tsx";
import useAuthJsonFetch from "../../../../common/api/hooks/useAuthJsonFetch.tsx";

export default function EditorQuestionnaireSubmissions() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const [questionnaireSubmissionsLoading, setQuestionnaireSubmissionsLoading] = useState<boolean>(true);
  const [questionnaireSubmissions, setQuestionnaireSubmissions] = useState<QuestionnaireSubmissionResponseDto[]>([]);
  const authJsonFetch = useAuthJsonFetch();
  const navigate = useNavigate();
  const notification = useNotification();
  const dialog = useDialog();

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
        path: `groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}/submissions`
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

  useEffect(() => {
    loadQuestionnaireSubmissions();
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

  const deleteSubmission = async (submissionId: number) => {
    try {
      setQuestionnaireSubmissionsLoading(true);
      const response = await authJsonFetch({
        path:
          `/groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}/submissions/${submissionId}`,
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

  if (permissionsLoading || questionnaireSubmissionsLoading) {
    return <LoadingSpinner/>;
  } else if (!projectPermissions.includes(PermissionType.PROJECT_EDITOR)) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: "Access Denied: Insufficient permissions"
    });
    navigate(`/groups/${groupId}/projects`);
    return <></>;
  }

  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={10} sm={10} md={9} lg={8}><Stack spacing={2}><Card>
        <CardHeader title={"Submitted Tests"} sx={{textAlign: "center"}}/>
        <CardContent>
          <TextField variant={"standard"} type={"search"}
                     label={"Search"}
                     fullWidth
                     onInput={handleQuestionnaireSubmissionsSearch}
          />
        </CardContent>
      </Card>
        {questionnaireSubmissionsFiltered?.length
          ?
          <EditorQuestionnaireSubmissionList questionnaireSubmissions={questionnaireSubmissionsFiltered}
                                             maxPoints={false}
                                             onDeleteClick={handleDeleteClick}
          />
          : <Card>
            <CardHeader title={"No submissions were found for this questionnaire."}
                        sx={{textAlign: "center"}}/>
          </Card>}
      </Stack>
      </Grid>
    </Grid>
  )
    ;
}
