import {useEffect, useMemo, useState} from "react";
import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../../authentication/hooks/usePermissions.ts";
import {useAuthJsonFetch} from "../../../../common/api/service/apiService.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useNotification} from "../../../../common/notification/context/NotificationProvider.tsx";
import {isValidId} from "../../../../common/utils/isValidId.ts";
import {QuestionnaireSubmissionResponseDto} from "../../../dto/QuestionnaireSubmissionResponseDto.ts";
import {PermissionType} from "../../../../authentication/dto/PermissionType.ts";
import {Card, CardContent, CardHeader, Grid, Stack, TextField} from "@mui/material";
import UserQuestionnaireSubmissionList from "../../user/submissions/components/UserQuestionnaireSubmissionList.tsx";
import BackButton from "../../../../common/utils/components/BackButton.tsx";

export default function EditorQuestionnaireSubmissions() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const [questionnaireSubmissionsLoading, setQuestionnaireSubmissionsLoading] = useState<boolean>(true);
  const [questionnaireSubmissions, setQuestionnaireSubmissions] = useState<QuestionnaireSubmissionResponseDto[]>([]);
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
      <Grid item xs={10} sm={10} md={9} lg={8}>
        {questionnaireSubmissionsFiltered?.length
          ? <Stack spacing={2}><Card>
            <CardHeader title={`${questionnaireSubmissionsFiltered[0].name}`} sx={{textAlign: "center"}}/>
            <CardContent>
              <TextField variant={"standard"} type={"search"}
                         label={"Search"}
                         fullWidth
                         onInput={handleQuestionnaireSubmissionsSearch}
              />
            </CardContent>
          </Card>
            <UserQuestionnaireSubmissionList questionnaireSubmissions={questionnaireSubmissionsFiltered}
                                             maxPoints={false}
            />
          </Stack>
          : <Card>
            <CardHeader title={"No submissions were found for this questionnaire."}
                        sx={{textAlign: "center"}}/>
            <CardContent sx={{justifyContent: "center"}}>
              <BackButton text={"Back to questionnaires"}/>
            </CardContent>
          </Card>}
      </Grid>
    </Grid>
  )
    ;
}
