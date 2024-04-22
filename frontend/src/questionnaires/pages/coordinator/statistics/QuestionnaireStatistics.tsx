import {useEffect, useRef, useState} from "react";
import {
  QuestionnaireSubmissionStatisticsResponseDto
} from "../../../dto/QuestionnaireSubmissionStatisticsResponseDto.ts";
import {QuestionnaireStatus} from "../../../dto/QuestionnaireStatus.ts";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  debounce,
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
import RichTextDisplay from "../../../../common/richTextEditor/RichTextDisplay.tsx";
import URLQueryPagination from "../../../../common/pagination/URLQueryPagination.tsx";
import {ApiResponsePageableDto} from "../../../../common/api/dto/ApiResponsePageableDto.ts";
import {QuestionnaireResponseEditorDto} from "../../../dto/QuestionnaireResponseEditorDto.ts";
import {useAuthentication} from "../../../../authentication/hooks/useAuthentication.ts";
import {FileDownload} from "@mui/icons-material";

export default function QuestionnaireStatistics() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const authJsonFetch = useAuthJsonFetch();
  const navigate = useNavigate();
  const notification = useNotification();
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireResponseEditorDto | undefined>(undefined);
  const [questionnaireLoading, setQuestionnaireLoading] = useState<boolean>(true);
  const [questionnaireStatistics, setQuestionnaireStatistics] = useState<QuestionnaireSubmissionStatisticsResponseDto[]>([]);
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
  const authentication = useAuthentication();

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
          `groups/${groupId}/projects/${projectId}/coordinator/questionnaires/${questionnaireId}`
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
      setQuestionnaire(response.data as QuestionnaireResponseEditorDto);
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

  async function loadQuestionnaireStatistics(search: string, currentPage: number, currentSize: number, currentStatus: QuestionnaireStatus) {
    try {
      setQuestionnaireStatisticsLoading(true);
      const usernameSearchEncoded = encodeURIComponent(search ?? "");
      const response = await authJsonFetch({
        path:
          `groups/${groupId}/projects/${projectId}/coordinator/questionnaires/${questionnaireId}/submissions/stats?status=${currentStatus}&page=${currentPage}&size=${currentSize}&search=${usernameSearchEncoded}`
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
      setQuestionnaireStatistics(pageableResponse.data as QuestionnaireSubmissionStatisticsResponseDto[]);
      const newTotalPages = Number(pageableResponse.totalPages);
      setTotalPages((newTotalPages && newTotalPages > 0) ? newTotalPages : 1);
      const newPage = pageableResponse.currentPage;
      const newSize = pageableResponse.size;
      searchParams.set("page", `${newPage}`);
      searchParams.set("size", `${newSize}`);
      navigate(`?${searchParams.toString()}`, {replace: true});
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
      loadQuestionnaireStatistics(searchValue, currentPage, currentSize, currentStatus).then();
    }, 300);

    loadQuestionnaire().then();
    loadQuestionnaireStatistics(usernameSearchValue, page, size, displayedQuestionnaireStatus).then();
  }, []);

  const handleStatisticsSearch = (event: any) => {
    const searchValue = event.target.value.toLowerCase().trim();
    setUsernameSearchValue(searchValue);
    reloadStatisticsDebouncedRef.current?.(searchValue, 1, size, displayedQuestionnaireStatus);
  };

  const handleSetStatus = (event: any) => {
    const newStatus = event.target.value;
    setDisplayedQuestionnaireStatus(newStatus);
    reloadStatisticsDebouncedRef.current?.(usernameSearchValue, 1, size, newStatus);
  }

  function handleSizeChange(newPage: number, newSize: number): void {
    reloadStatisticsDebouncedRef.current?.(usernameSearchValue, newPage, newSize, displayedQuestionnaireStatus);
  }

  function handlePageChange(newPage: number): void {
    reloadStatisticsDebouncedRef.current?.(usernameSearchValue, newPage, size, displayedQuestionnaireStatus);
  }

  const handleExcelDownload = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/groups/${groupId}/projects/${projectId}/coordinator/questionnaires/${questionnaireId}/submissions/stats/excel?status=${displayedQuestionnaireStatus}`, {
          headers: {
            Authorization: `Bearer ${authentication.getAccessToken()}`,
          }
        });
      if (!response.ok || response.status > 399) {
        const res = await response.json();
        console.error(res?.error,"-",res?.message);
        handleErrorNotification(res?.error ?? "Failed to download template");
        return;
      }
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", "questionnaire-statistics.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (e) {
      console.error(e);
      handleErrorNotification("Failed to download template");
    }
  };

  const hasValidSubmission = (stat: QuestionnaireSubmissionStatisticsResponseDto) => {
    return stat.maxPointSubmissionId !== null && stat.maxPointSubmissionId !== undefined &&
      stat.maxPointSubmissionCreatedAt !== null && stat.maxPointSubmissionCreatedAt !== undefined &&
      stat.maxPointSubmissionReceivedPoints !== null && stat.maxPointSubmissionReceivedPoints !== undefined &&
      stat.lastSubmissionId !== null && stat.lastSubmissionId !== undefined &&
      stat.lastSubmissionCreatedAt !== null && stat.lastSubmissionCreatedAt !== undefined &&
      stat.lastSubmissionReceivedPoints !== null && stat.lastSubmissionReceivedPoints !== undefined;
  }

  if (permissionsLoading || questionnaireLoading) {
    return <LoadingSpinner/>;
  } else if ((!projectPermissions?.length) || !projectPermissions.includes(PermissionType.PROJECT_COORDINATOR)) {
    handleErrorNotification("Access Denied: Insufficient permissions");
    navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`, {replace: true});
    return <></>;
  } else if (!questionnaire) {
    handleErrorNotification("Failed to load questionnaire");
    navigate(`/groups/${groupId}/projects/${projectId}/coordinator/questionnaires`, {replace: true});
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
          </Stack>
        </Grid>
        <Grid item xs={12} mb={2}>
          <Grid container spacing={2} alignItems={"center"} justifyContent={"space-between"}>
            <Grid item xs={12} md={"auto"}>
              <Typography variant={"body2"}>
                Created
                By {questionnaire.createdBy.username} at {getLocalizedDateTime(new Date(questionnaire.createdAt))}
              </Typography>
            </Grid>
            <Grid item xs={12} md={"auto"}>
              <Typography variant={"body2"}>
                Last Updated
                By {questionnaire.updatedBy.username} at {getLocalizedDateTime(new Date(questionnaire.updatedAt))}
              </Typography>
            </Grid>
            <Grid item xs={12} md={"auto"}>
              <Typography variant={"body2"}>
                Current Status: {questionnaire.status}
              </Typography>
            </Grid>
            <Grid item xs={12} md={"auto"}>
              <Typography variant={"body2"}>
                Max Points: {questionnaire.maxPoints}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} mb={2}>
          <Grid container spacing={2}>
            <Grid item><Button
              onClick={handleExcelDownload}
              startIcon={<FileDownload/>}>
              Export to excel (.xlsx)
            </Button></Grid>
            <Grid item><Button onClick={() => {
              navigate(`/groups/${groupId}/projects/${projectId}/coordinator/questionnaires`);
            }}
                               sx={{width: "fit-content"}} variant={"outlined"}>
              Back To Questionnaires
            </Button></Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}><Grid container spacing={1}>
          <Grid item xs={12} sm={true}>
            <TextField type={"search"}
                       placeholder={"Search by username"}
                       fullWidth
                       onChange={handleStatisticsSearch}/>
          </Grid>
          <Grid item xs={12} sm={"auto"}>
            <Select value={displayedQuestionnaireStatus} onChange={handleSetStatus}
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
            <URLQueryPagination totalPages={totalPages} defaultPage={1}
                                onPageChange={handlePageChange}
                                onSizeChange={handleSizeChange}/>
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
