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
  FormControl,
  Grid,
  InputLabel,
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
//import RichTextDisplay from "../../../../common/richTextEditor/RichTextDisplay.tsx";
import URLQueryPagination from "../../../../common/pagination/URLQueryPagination.tsx";
import {ApiResponsePageableDto} from "../../../../common/api/dto/ApiResponsePageableDto.ts";
import {QuestionnaireResponseEditorDto} from "../../../dto/QuestionnaireResponseEditorDto.ts";
import {AccountBoxRounded, Check, Close, Downloading, FileDownload, MailOutlined} from "@mui/icons-material";
import useAuthFetch from "../../../../common/api/hooks/useAuthFetch.tsx";
import {useDialog} from "../../../../common/dialog/context/DialogProvider.tsx";
import CopyButton from "../../../../common/utils/components/CopyButton.tsx";
import useLocalized from "../../../../common/localization/hooks/useLocalized.tsx";


export default function QuestionnaireStatistics() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const authJsonFetch = useAuthJsonFetch();
  const authFetch = useAuthFetch();
  const navigate = useNavigate();
  const notification = useNotification();
  const [questionnaire, setQuestionnaire] = useState<QuestionnaireResponseEditorDto | undefined>(undefined);
  const [questionnaireLoading, setQuestionnaireLoading] = useState<boolean>(true);
  const [questionnaireStatistics, setQuestionnaireStatistics] = useState<QuestionnaireSubmissionStatisticsResponseDto[]>([]);
  const [questionnaireStatisticsLoading, setQuestionnaireStatisticsLoading] = useState<boolean>(true)
  const [displayedQuestionnaireStatus, setDisplayedQuestionnaireStatus] = useState<QuestionnaireStatus>(QuestionnaireStatus.ACTIVE);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
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
  const dialog = useDialog();

  const localized = useLocalized();

  function handleErrorNotification(message: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center", message: message
    });
  }

  async function loadQuestionnaire() {
    const defaultError = localized("questionnaire.failed_to_load_questionnaire_error");
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
          type: "error", vertical: "top", horizontal: "center", message: response?.error ?? defaultError
        });
        return;
      }
      setQuestionnaire(response.data as QuestionnaireResponseEditorDto);
    } catch (e) {
      setQuestionnaire(undefined)
      notification.openNotification({
        type: "error", vertical: "top", horizontal: "center", message: defaultError
      });
    } finally {
      setQuestionnaireLoading(false);
    }
  }

  async function loadQuestionnaireStatistics(search: string, currentPage: number, currentSize: number, currentStatus: QuestionnaireStatus) {
    const defaultError = localized("statistics.failed_to_load_statistics_error");
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
          message: response?.error ?? defaultError
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
        message: defaultError
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
    const defaultError = localized("statistics.failed_to_download_statistics_error");
    try {
      setDownloadLoading(true);
      const userTimezone = encodeURIComponent(Intl.DateTimeFormat().resolvedOptions().timeZone);
      let fileName =
        `questionnaire-statistics-${questionnaire?.name}-${getLocalizedDateTime(new Date())}-${displayedQuestionnaireStatus}`;
      if (usernameSearchValue?.length) {
        fileName = fileName.concat(`-searchValue-${usernameSearchValue.trim().toLowerCase()}`)
      }

      // @ts-expect-error replaceAll does in fact exist here on type string
      fileName = fileName.trim().toLowerCase().replaceAll(" ", "_").replaceAll(".", "")
        .concat(".xlsx");
      const response = await authFetch({
        path:
          `groups/${groupId}/projects/${projectId}/coordinator/questionnaires/${questionnaireId}/submissions/stats/excel?status=${displayedQuestionnaireStatus}&timeZone=${userTimezone}&search=${usernameSearchValue}`,
        contentType: "application/*"
      });
      if (!response || response.status > 399) {
        handleErrorNotification(response?.error ?? defaultError);
        return;
      }
      const blob = await response?.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (e) {
      handleErrorNotification(defaultError);
    } finally {
      setDownloadLoading(false);
    }
  };

  const hasValidSubmission = (stat: QuestionnaireSubmissionStatisticsResponseDto) => {
    return stat.maxPointSubmissionId !== null && stat.maxPointSubmissionId !== undefined &&
      stat.maxPointSubmissionCreatedAt !== null && stat.maxPointSubmissionCreatedAt !== undefined &&
      stat.maxPointSubmissionReceivedPoints !== null && stat.maxPointSubmissionReceivedPoints !== undefined;
  }

  const handleContactClick = (data: QuestionnaireSubmissionStatisticsResponseDto) => {
    dialog.openDialog({
      oneActionOnly: true, confirmText: "Close", onConfirm: () => {
      },
      content: <Grid container spacing={2} alignItems={"center"} justifyContent={"space-between"}
                     maxWidth={"fit-content"}>
        <Grid item xs={12}>
          <Stack spacing={1} direction={"row"} alignItems={"center"}>
            <AccountBoxRounded/>
            <Typography variant={"h6"}>{data.fullName}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography>Username:</Typography>
          <Typography>{data.username}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>E-mail Address:</Typography>
          <CopyButton text={data.email}/>
        </Grid>
      </Grid>
    })
  }

  if (permissionsLoading || questionnaireLoading) {
    return <LoadingSpinner/>;
  } else if ((!projectPermissions?.length) || !projectPermissions.includes(PermissionType.PROJECT_COORDINATOR)) {
    handleErrorNotification(localized("common.auth.access_denied"));
    navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`, {replace: true});
    return <></>;
  } else if (!questionnaire) {
    handleErrorNotification(localized("questionnaire.failed_to_load_questionnaire_error"));
    navigate(`/groups/${groupId}/projects/${projectId}/coordinator/questionnaires`, {replace: true});
    return <></>;
  }

  return (
    <Grid container justifyContent={"center"} alignItems={"center"}><Grid item xs={11}><Card>
      <CardHeader title={localized("statistics.questionnaire_statistics")}/>
      <CardContent><Grid container>
        <Grid item xs={12}>
          <Stack spacing={1} sx={{marginBottom: 2}}>
            <Typography variant={"h6"}>{questionnaire.name}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} mb={2}>
          <Grid container spacing={2} alignItems={"left"} justifyContent={"left"}>
            <Grid item xs={12} md={"auto"}>
              <Typography variant={"body2"}>
                {localized("statistics.created_by")}: {questionnaire.createdBy.username} - {getLocalizedDateTime(new Date(questionnaire.createdAt))}
              </Typography>
            </Grid>
            <Grid item xs={12} md={"auto"}>
              <Typography variant={"body2"}>
                {localized("statistics.updated_by")}: {questionnaire.updatedBy.username} - {getLocalizedDateTime(new Date(questionnaire.updatedAt))}
              </Typography>
            </Grid>
            <Grid item xs={12} md={"auto"}>
              <Typography variant={"body2"}>
                {localized("statistics.status")}: {questionnaire.status.toString() === "ACTIVE" ? localized("statistics.active") : localized("statistics.test")}
              </Typography>
            </Grid>
            <Grid item xs={12} md={"auto"}>
              <Typography variant={"body2"}>
                {localized("questionnaire.max_points")}: {questionnaire.maxPoints}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} mb={2}>
          <Grid container spacing={2}>
            <Grid item>
              {downloadLoading
                ? <Button variant={"contained"}
                          color={"success"}
                          disabled
                          sx={{minWidth: 220}}
                          startIcon={<Downloading/>}>
                  {localized("statistics.exporting")}
                </Button>
                : <Button variant={"contained"} color={"success"}
                          onClick={handleExcelDownload}
                          sx={{minWidth: 220}}
                          startIcon={<FileDownload/>}>
                  {localized("statistics.export_to_excel")}
                </Button>}
            </Grid>
            <Grid item><Button onClick={() => {
              navigate(`/groups/${groupId}/projects/${projectId}/coordinator/questionnaires`);
            }}
                               sx={{width: "fit-content"}} variant={"outlined"}>
              {localized("questionnaire.back_to_questionnaires")}
            </Button></Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}><Grid container spacing={2}>
          <Grid item xs={12} sm={true}>
            <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
              <FormControl>
                <InputLabel id="status_select_label">{localized("statistics.status")}</InputLabel>
                <Select labelId={"status_select_label"} label={"Status"} value={displayedQuestionnaireStatus}
                        onChange={handleSetStatus}
                        sx={{minWidth: 150}}>
                  <MenuItem value={QuestionnaireStatus.ACTIVE}><Typography>
                    {localized("statistics.active")}
                  </Typography></MenuItem>
                  <MenuItem value={QuestionnaireStatus.TEST}><Typography>
                    {localized("statistics.test")}
                  </Typography></MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={"auto"}>
            <URLQueryPagination totalPages={totalPages} defaultPage={1}
                                onPageChange={handlePageChange}
                                onSizeChange={handleSizeChange}/>
          </Grid>
          <Grid item xs={12} mb={2}>
            <TextField type={"search"}
                       placeholder={localized("statistics.statistics_search_by")}
                       fullWidth
                       onChange={handleStatisticsSearch}/>
          </Grid>
        </Grid></Grid>
        <Grid item xs={12}><TableContainer component={Paper}>
          <Table sx={{minWidth: 1000, overflowX: "scroll"}}>
            <TableHead>
              <TableRow>
                <TableCell>{localized("statistics.username")}</TableCell>
                <TableCell>{localized("statistics.name")}</TableCell>
                <TableCell>{localized("statistics.max_date")}</TableCell>
                <TableCell>{localized("statistics.max_points")}</TableCell>
                <TableCell>{localized("statistics.total_submissions")}</TableCell>
                <TableCell>{localized("statistics.coordinator")}</TableCell>
                <TableCell>{localized("statistics.external_questionnaire")}</TableCell>
                <TableCell>{localized("statistics.external_failure")}</TableCell>
                <TableCell>{localized("statistics.completion_email")}</TableCell>
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
                      key={`${stat.userId}-${stat.maxPointSubmissionId}`}
                      sx={{'&:last-child td, &:last-child th': {border: 0}}}
                    >
                      <TableCell>{stat.username}</TableCell>
                      <TableCell>
                        <Button color={"inherit"} variant={"text"} sx={{padding: 0, textTransform: "none"}}
                                onClick={() => handleContactClick(stat)}>
                          <Stack spacing={0.5} alignItems={"center"} justifyContent={"left"}
                                 direction={"row"}><MailOutlined/><Typography
                            whiteSpace={"nowrap"}>{stat.fullName}</Typography></Stack>
                        </Button>
                      </TableCell>
                      {hasValidSubmission(stat)
                        ? <>
                          <TableCell> {getLocalizedDateTime(new Date(stat.maxPointSubmissionCreatedAt as string))}</TableCell>
                          <TableCell>{stat.maxPointSubmissionReceivedPoints} / {stat.questionnaireMaxPoints}</TableCell>
                          <TableCell>{stat.submissionCount}</TableCell>
                        </>
                        : <>
                          <TableCell>-</TableCell><TableCell>-</TableCell><TableCell>0</TableCell>
                        </>}
                      <TableCell><Typography
                        whiteSpace={"nowrap"}>{stat.currentCoordinatorFullName}</Typography></TableCell>
                      <TableCell>{stat.hasExternalTestQuestionnaire ? <Check/> : <Close/>}</TableCell>
                      <TableCell>{stat.hasExternalTestFailure ? <Check/> : <Close/>}</TableCell>
                      <TableCell>{stat.receivedSuccessfulCompletionEmail ? <Check/> : <Close/>}</TableCell>
                    </TableRow>
                  ))
                  : <TableRow>
                    <TableCell>{localized("statistics.no_found")}</TableCell>
                  </TableRow>}
            </TableBody>
          </Table>
        </TableContainer></Grid>
      </Grid></CardContent>
    </Card></Grid></Grid>
  );
}
