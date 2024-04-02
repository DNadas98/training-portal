import {useEffect, useMemo, useState} from "react";
import {QuestionnaireSubmissionResponseAdminDto} from "../../../dto/QuestionnaireSubmissionResponseAdminDto.ts";
import {QuestionnaireStatus} from "../../../dto/QuestionnaireStatus.ts";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import useAuthJsonFetch from "../../../../common/api/hooks/useAuthJsonFetch.tsx";
import {useNotification} from "../../../../common/notification/context/NotificationProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import usePermissions from "../../../../authentication/hooks/usePermissions.ts";
import useLocalizedDateTime from "../../../../common/localization/hooks/useLocalizedDateTime.tsx";
import {PermissionType} from "../../../../authentication/dto/PermissionType.ts";
import {QuestionnaireResponseDto} from "../../../dto/QuestionnaireResponseDto.ts";
import RichTextDisplay from "../../../../common/richTextEditor/RichTextDisplay.tsx";

export default function QuestionnaireStatistics() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const authJsonFetch = useAuthJsonFetch();
  const navigate = useNavigate();
  const notification = useNotification();
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireResponseDto | undefined>(undefined);
  const [questionnaireLoading, setQuestionnaireLoading] = useState<boolean>(true);
  const [questionnaireStatistics, setQuestionnaireStatistics] = useState<QuestionnaireSubmissionResponseAdminDto[]>([]);
  const [questionnaireStatisticsLoading, setQuestionnaireStatisticsLoading] = useState<boolean>(true)
  const [displayedQuestionnaireStatus, setDisplayedQuestionnaireStatus] = useState<QuestionnaireStatus>(QuestionnaireStatus.ACTIVE);
  const getLocalizedDateTime = useLocalizedDateTime();

  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const questionnaireId = useParams()?.questionnaireId;

  function handleErrorNotification(message: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center", message: message
    });
  }

  async function loadQuestionnaire() {
    try {
      setQuestionnaireLoading(true);
      const response = await authJsonFetch({
        path:
          `groups/${groupId}/projects/${projectId}/editor/questionnaires/${questionnaireId}`
        , method: "GET"
      });
      if (!response || !response?.status || !response.data || response.status > 399) {
        setQuestionnaire(undefined);
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: response?.error ?? "Failed to load questionnaire"
        });
        return;
      }
      setQuestionnaire(response.data as QuestionnaireResponseDto);
    } catch (e) {
      setQuestionnaire(undefined)
      notification.openNotification({
        type: "error", vertical: "top", horizontal: "center",
        message: "Failed to load questionnaire statistics"
      });
    } finally {
      setQuestionnaireLoading(false);
    }
  }

  async function loadQuestionnaireStatistics() {
    try {
      setQuestionnaireStatisticsLoading(true);
      const response = await authJsonFetch({
        path:
          `groups/${groupId}/projects/${projectId}/admin/questionnaires/${questionnaireId}/submissions/stats?status=${displayedQuestionnaireStatus}`
        , method: "GET"
      });
      if (!response || !response?.status || !response.data || response.status > 399) {
        setQuestionnaireStatistics([]);
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: response?.error ?? "Failed to load questionnaire statistics"
        });
        return;
      }
      setQuestionnaireStatistics(response.data as QuestionnaireSubmissionResponseAdminDto[]);
    } catch (e) {
      setQuestionnaireStatistics([]);
      notification.openNotification({
        type: "error", vertical: "top", horizontal: "center",
        message: "Failed to load questionnaire statistics"
      });
    } finally {
      setQuestionnaireStatisticsLoading(false);
    }
  }

  useEffect(() => {
    loadQuestionnaire()
  }, []);

  useEffect(() => {
    loadQuestionnaireStatistics()
  }, [displayedQuestionnaireStatus]);


  const [statisticsFilterValue, setStatisticsFilterValue] = useState<string>("");
  const statisticsFiltered = useMemo(() => {
    if (!questionnaireStatistics?.length) {
      return [];
    }
    return questionnaireStatistics.filter(stat => {
        return stat.username.toLowerCase().includes(statisticsFilterValue)
      }
    );
  }, [questionnaireStatistics, statisticsFilterValue]);
  const handleStatisticsSearch = (event: any) => {
    setStatisticsFilterValue(event.target.value.toLowerCase().trim());
  };

  const hasValidSubmission = (stat: QuestionnaireSubmissionResponseAdminDto) => {
    return stat.maxPointSubmissionId !== null && stat.maxPointSubmissionId !== undefined &&
      stat.maxPointSubmissionCreatedAt !== null && stat.maxPointSubmissionCreatedAt !== undefined &&
      stat.maxPointSubmissionReceivedPoints !== null && stat.maxPointSubmissionReceivedPoints !== undefined &&
      stat.lastSubmissionId !== null && stat.lastSubmissionId !== undefined &&
      stat.lastSubmissionCreatedAt !== null && stat.lastSubmissionCreatedAt !== undefined &&
      stat.lastSubmissionReceivedPoints !== null && stat.lastSubmissionReceivedPoints !== undefined;
  }

  if (permissionsLoading || questionnaireLoading || questionnaireStatisticsLoading) {
    return <LoadingSpinner/>;
  } else if ((!projectPermissions?.length) || !projectPermissions.includes(PermissionType.PROJECT_ADMIN)) {
    handleErrorNotification("Access Denied: Insufficient permissions");
    navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`, {replace: true});
    return <></>;
  } else if (!questionnaire) {
    handleErrorNotification("Failed to load questionnaire");
    navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`, {replace: true});
    return <></>;
  }

  return (
    <Grid container justifyContent={"center"} alignItems={"center"}><Grid item xs={11}><Card>
      <CardHeader title={"Questionnaire Statistics"}/>
      <CardContent>{questionnaireStatisticsLoading
        ? <LoadingSpinner/>
        : <Grid container>
          <Grid item xs={12}>
            <Stack spacing={1} sx={{marginBottom: 2}}>
              <Typography variant={"h6"}>{questionnaire.name}</Typography>
              <RichTextDisplay content={questionnaire.description}/>
              <Button onClick={() => navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`)}
                      sx={{width: "fit-content"}} variant={"outlined"}>
                Back to Questionnaires
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12}><Grid container spacing={1}>
            <Grid item xs={12} sm={true}>
              <TextField type={"search"}
                         placeholder={"Search by username"}
                         fullWidth
                         onChange={handleStatisticsSearch}/>
            </Grid>
            <Grid item xs={12} sm={"auto"}>
              <Select value={displayedQuestionnaireStatus} onChange={(event: any) => {
                setDisplayedQuestionnaireStatus(event.target.value);
              }}
                      sx={{minWidth: 150}}>
                <MenuItem value={QuestionnaireStatus.ACTIVE}><Typography>
                  Active
                </Typography></MenuItem>
                <MenuItem value={QuestionnaireStatus.TEST}><Typography>
                  Test
                </Typography></MenuItem>
              </Select>
            </Grid>
          </Grid></Grid>
          <Grid item xs={12}><TableContainer component={Paper}>
            <Table sx={{minWidth: 500}}>
              <TableHead>
                <TableRow>
                  <TableCell>Username</TableCell>
                  <TableCell>Max Date</TableCell>
                  <TableCell>Max Points</TableCell>
                  <TableCell>Last Date</TableCell>
                  <TableCell>Last Points</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statisticsFiltered?.length
                  ? statisticsFiltered.map((stat) => (
                    <TableRow
                      key={`${stat.userId}-${stat.lastSubmissionId}-${stat.maxPointSubmissionId}`}
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                      <TableCell>{stat.username}</TableCell>
                      {hasValidSubmission(stat)
                        ? <>
                          <TableCell> {getLocalizedDateTime(new Date(stat.maxPointSubmissionCreatedAt as string))}</TableCell>
                          <TableCell>{stat.maxPointSubmissionReceivedPoints} / {stat.questionnaireMaxPoints}</TableCell>
                          <TableCell>{getLocalizedDateTime(new Date(stat.lastSubmissionCreatedAt as string))}</TableCell>
                          <TableCell>{stat.lastSubmissionReceivedPoints} / {stat.questionnaireMaxPoints}</TableCell>
                        </>
                        : <TableCell>No questionnaire submissions found</TableCell>}
                    </TableRow>
                  ))
                  : <TableRow>
                    <TableCell>No filled out questionnaires were found</TableCell>
                  </TableRow>}
              </TableBody>
            </Table>
          </TableContainer></Grid>
        </Grid>
      }</CardContent>
    </Card></Grid></Grid>
  );
}
