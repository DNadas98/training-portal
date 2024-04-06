import {useEffect, useRef, useState} from "react";
import {QuestionnaireSubmissionResponseAdminDto} from "../../../dto/QuestionnaireSubmissionResponseAdminDto.ts";
import {QuestionnaireStatus} from "../../../dto/QuestionnaireStatus.ts";
import {
  Button,
  Card,
  CardContent,
  CardHeader, debounce,
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
import {useLocation, useNavigate, useParams} from "react-router-dom";
import usePermissions from "../../../../authentication/hooks/usePermissions.ts";
import useLocalizedDateTime from "../../../../common/localization/hooks/useLocalizedDateTime.tsx";
import {PermissionType} from "../../../../authentication/dto/PermissionType.ts";
import {QuestionnaireResponseDto} from "../../../dto/QuestionnaireResponseDto.ts";
import RichTextDisplay from "../../../../common/richTextEditor/RichTextDisplay.tsx";
import URLQueryPagination from "../../../../common/pagination/URLQueryPagination.tsx";
import {ApiResponsePageableDto} from "../../../../common/api/dto/ApiResponsePageableDto.ts";

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


  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [totalPages, setTotalPages] = useState(1);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const size = parseInt(searchParams.get('size') || '10', 10);
  const [usernameSearchValue, setUsernameSearchValue] = useState<string>("");

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

  async function loadQuestionnaireStatistics(search: string, currentPage: number, currentSize: number, currentStatus) {
    try {
      setQuestionnaireStatisticsLoading(true);
      const usernameSearchEncoded = encodeURIComponent(search ?? "");
      const response = await authJsonFetch({
        path:
          `groups/${groupId}/projects/${projectId}/admin/questionnaires/${questionnaireId}/submissions/stats?status=${currentStatus}&page=${currentPage}&size=${currentSize}&search=${usernameSearchEncoded}`
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
      const pageableResponse = response as unknown as ApiResponsePageableDto;
      setQuestionnaireStatistics(pageableResponse.data as QuestionnaireSubmissionResponseAdminDto[]);
      const newTotalPages = Number(pageableResponse.totalPages);
      setTotalPages((newTotalPages && newTotalPages > 0) ? newTotalPages : 1);
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

  const reloadStatisticsDebouncedRef = useRef<(searchValue: string, currentPage: number, currentSize: number, currentStatus) => void>();

  useEffect(() => {
    reloadStatisticsDebouncedRef.current = debounce((searchValue, currentPage, currentSize, currentStatus) => {
      loadQuestionnaireStatistics(searchValue, currentPage, currentSize, currentStatus);
    }, 300);

    loadQuestionnaire();
  }, []);

  const handleStatisticsSearch = (event: any) => {
    const searchValue = event.target.value.toLowerCase().trim();
    setUsernameSearchValue(searchValue);
  };

  useEffect(() => {
    reloadStatisticsDebouncedRef.current?.(usernameSearchValue, page, size, displayedQuestionnaireStatus);
  }, [page, size, usernameSearchValue, displayedQuestionnaireStatus]);

  const hasValidSubmission = (stat: QuestionnaireSubmissionResponseAdminDto) => {
    return stat.maxPointSubmissionId !== null && stat.maxPointSubmissionId !== undefined &&
      stat.maxPointSubmissionCreatedAt !== null && stat.maxPointSubmissionCreatedAt !== undefined &&
      stat.maxPointSubmissionReceivedPoints !== null && stat.maxPointSubmissionReceivedPoints !== undefined &&
      stat.lastSubmissionId !== null && stat.lastSubmissionId !== undefined &&
      stat.lastSubmissionCreatedAt !== null && stat.lastSubmissionCreatedAt !== undefined &&
      stat.lastSubmissionReceivedPoints !== null && stat.lastSubmissionReceivedPoints !== undefined;
  }

  if (permissionsLoading || questionnaireLoading) {
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
      <CardContent><Grid container>
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
          <Grid item xs={12} sm={"auto"}>
            <URLQueryPagination totalPages={totalPages} defaultPage={1}/>
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
                <TableCell>Past Submissions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {questionnaireStatisticsLoading
                ? <TableRow
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell><LoadingSpinner/></TableCell></TableRow>
                : questionnaireStatistics?.length
                  ? questionnaireStatistics.map((stat) => (
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
                          <TableCell>{stat.submissionCount}</TableCell>
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
      </Grid></CardContent>
    </Card></Grid></Grid>
  );
}
