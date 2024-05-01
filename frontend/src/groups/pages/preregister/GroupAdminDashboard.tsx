import {ChangeEvent, useEffect, useState} from "react";
import {ProjectResponsePublicDto} from "../../../projects/dto/ProjectResponsePublicDto.ts";
import {QuestionnaireResponseEditorDto} from "../../../questionnaires/dto/QuestionnaireResponseEditorDto.ts";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";
import useAuthFetch from "../../../common/api/hooks/useAuthFetch.tsx";
import {Avatar, Button, Card, CardActions, CardHeader, Grid, Typography, useTheme} from "@mui/material";
import {formatISO} from "date-fns";
import {PreRegisterUsersReportDto} from "../../../admin/dto/PreRegisterUsersReportDto.ts";
import UserPreRegistrationReport from "../../../admin/pages/adminDashboard/components/UserPreRegistrationReport.tsx";
import {CompletionMailReportDto} from "../../../admin/dto/CompletionMailReportDto.ts";
import CompletionMailReport from "../../../admin/pages/adminDashboard/components/CompletionMailReport.tsx";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {MailRounded} from "@mui/icons-material";
import {isValidId} from "../../../common/utils/isValidId.ts";
import GroupAdminUserPreRegistrationForm from "./components/GroupAdminUserPreRegistrationForm.tsx";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {PermissionType} from "../../../authentication/dto/PermissionType.ts";

export default function GroupAdminDashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const groupId = useParams()?.groupId;

  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectResponsePublicDto[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectResponsePublicDto | null | undefined>(null);
  const [projectFilterValue, setProjectFilterValue] = useState<string>("");

  const [questionnairesLoading, setQuestionnairesLoading] = useState<boolean>(false);
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireResponseEditorDto[]>([]);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<QuestionnaireResponseEditorDto | null | undefined>(null);
  const [questionnaireFilterValue, setQuestionnaireFilterValue] = useState<string>("");

  const [selectedFile, setSelectedFile] = useState<File | undefined | null>(null);
  const MAX_FILE_SIZE = 400000; // 400 KB

  const [expiresAt, setExpiresAt] = useState<Date>(new Date());

  const notification = useNotification();
  const dialog = useDialog();
  const navigate = useNavigate();
  const authJsonFetch = useAuthJsonFetch();
  const authFetch = useAuthFetch();
  const theme = useTheme();
  const {loading: permissionsLoading, groupPermissions} = usePermissions();

  const openErrorNotification = (message: string) => notification.openNotification({
    type: "error", vertical: "top", horizontal: "center", message: message
  });

  const trimAndLowercase = (input: any) => {
    if (!input || !input.toString()) {
      return "";
    }
    return input.toString().trim().toLowerCase();
  }

  useEffect(() => {
    loadProjects().then();
  }, []);

  const loadProjects = async () => {
    const defaultError = "Failed to load projects";
    if (!groupId || !isValidId(groupId)) {
      setProjects([]);
    }
    try {
      setProjectsLoading(true);
      setSelectedProject(null);
      setProjectFilterValue("");
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/all`
      });
      if (!response || !response.data || response.status > 399) {
        openErrorNotification(response?.error ?? defaultError);
        setProjects([]);
        return;
      }
      setProjects(response.data);
    } catch (e) {
      openErrorNotification(defaultError);
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  }

  const handleProjectSearchInputChange = (e: any) => {
    setProjectFilterValue(trimAndLowercase(e.target.value));
  }

  const handleProjectSelect = (_event: ChangeEvent<NonNullable<unknown>>, newValue: ProjectResponsePublicDto | null) => {
    setSelectedProject(newValue);
  };

  useEffect(() => {
    loadProjects().then();
  }, [groupId]);

  const loadQuestionnaires = async () => {
    const defaultError = "Failed to load questionnaires";
    try {
      setQuestionnairesLoading(true);
      setSelectedQuestionnaire(null);
      setQuestionnaireFilterValue("");
      if (!groupId || !selectedProject) {
        setQuestionnaires([]);
        return;
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${selectedProject.projectId}/questionnaires/all`
      });
      if (!response || !response.data || response.status > 399) {
        openErrorNotification(response?.error ?? defaultError);
        setQuestionnaires([]);
        return;
      }
      setQuestionnaires(response.data);
    } catch (e) {
      openErrorNotification(defaultError);
      setQuestionnaires([]);
    } finally {
      setQuestionnairesLoading(false);
    }
  }

  const handleQuestionnaireSearchInputChange = (e: any) => {
    setQuestionnaireFilterValue(trimAndLowercase(e.target.value));
  }

  const handleQuestionnaireSelect = (_event: ChangeEvent<NonNullable<unknown>>, newValue: QuestionnaireResponseEditorDto | null) => {
    setSelectedQuestionnaire(newValue);
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const selectedFile = files[0];
      if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
        openErrorNotification("The selected file must have .csv extension");
        setSelectedFile(null);
        return;
      }
      if (selectedFile.size > MAX_FILE_SIZE) {
        openErrorNotification("The selected file is too large. Maximum allowed size is 400 KB");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(selectedFile);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const defaultError = "Failed to upload user data";
    if (!groupId) {
      return;
    }
    if (!selectedFile || !selectedProject || !selectedQuestionnaire) {
      openErrorNotification("All fields are required");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("projectId", selectedProject.projectId.toString());
      formData.append("questionnaireId", selectedQuestionnaire.id.toString());
      formData.append("expiresAt", formatISO(expiresAt));
      const response = await authFetch({
        path: `groups/${groupId}/pre-register/users`,
        method: 'POST',
        body: formData
      }).then(res => res.json());
      if (!response || response.status > 399 || !response.data) {
        openErrorNotification(response?.error ?? defaultError);
        return;
      }
      setSelectedFile(null);
      setExpiresAt(new Date());
      handleSuccess(response.data as PreRegisterUsersReportDto);
    } catch (error) {
      openErrorNotification(defaultError);
    } finally {
      setLoading(false);
    }
  }

  function handleSuccess(reportDto: PreRegisterUsersReportDto) {
    dialog.openDialog({
      oneActionOnly: true, confirmText: "Ok", onConfirm: () => {
      },
      content: <UserPreRegistrationReport
        totalUsers={reportDto.totalUsers}
        createdUsers={reportDto.createdUsers}
        updatedUsers={reportDto.updatedUsers}
        failedUsers={reportDto.failedUsers}/>
    });
  }

  const handleBackClick = () => {
    navigate("/user");
  }

  const handleDownloadTemplate = async () => {
    try {
      if (downloadLoading) {
        return;
      }
      setDownloadLoading(true);
      const response = await authFetch({
        path: `groups/${groupId}/pre-register/users/csv-template`,
        contentType: "text/csv"
      });
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", "user_pre_registration_template.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (e) {
      openErrorNotification("Failed to download template");
    } finally {
      setDownloadLoading(false);
    }
  };

  useEffect(() => {
    loadQuestionnaires().then();
  }, [groupId, selectedProject]);

  function handleExpirationChange(newValue: Date) {
    setExpiresAt(newValue);
  }

  async function handleSendCompletionMail() {
    const defaultError = "Failed to send successful completion e-mails";
    try {
      setLoading(true);
      if (!groupId || !selectedProject || !selectedQuestionnaire) {
        openErrorNotification("Select project and questionnaire first!")
        return;
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/completion-mail/projects/${selectedProject.projectId}`,
        method: "POST"
      });
      if (!response || !response.data || response.status > 399) {
        openErrorNotification(response?.error ?? defaultError);
        return;
      }
      const reportDto: CompletionMailReportDto = response.data;
      dialog.openDialog({
        oneActionOnly: true, confirmText: "Ok", onConfirm: () => {
        },
        content: <CompletionMailReport
          totalUsers={reportDto.totalUsers}
          successful={reportDto.successful}
          failed={reportDto.failed}/>
      });
    } catch (e) {
      openErrorNotification(defaultError);
    } finally {
      setLoading(false);
    }
  }

  if (loading || permissionsLoading) {
    return <LoadingSpinner/>;
  } else if (!groupPermissions?.length||!groupPermissions.includes(PermissionType.GROUP_ADMIN)) {
    notification.openNotification({type: "error", horizontal: "center", vertical: "top",
      message: "Access Denied: Insufficient permissions"});
    navigate(`/groups`, {replace: true});
    return <></>;
  }

  return loading ? <LoadingSpinner/> :
    <Grid container justifyContent={"center"} alignItems={"center"} spacing={2}>
      <Grid item xs={10} sm={8}>
        <GroupAdminUserPreRegistrationForm
          projects={projects.filter(project => project.name.trim().toLowerCase().includes(projectFilterValue))}
          projectsLoading={projectsLoading}
          selectedProject={selectedProject}
          onProjectSelect={handleProjectSelect}
          onProjectSearchInputChange={handleProjectSearchInputChange}
          questionnaires={questionnaires.filter(questionnaire => questionnaire.name.trim().toLowerCase().includes(questionnaireFilterValue))}
          questionnairesLoading={questionnairesLoading}
          selectedQuestionnaire={selectedQuestionnaire}
          onQuestionnaireSelect={handleQuestionnaireSelect}
          onQuestionnaireSearchInputChange={handleQuestionnaireSearchInputChange}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onSubmit={handleSubmit}
          onBackClick={handleBackClick}
          onDownloadTemplate={handleDownloadTemplate}
          expiresAt={expiresAt}
          onExpiresAtChange={handleExpirationChange}/>
      </Grid>
      <Grid item xs={10} sm={8}><Card>
        <CardHeader title={"Send Successful Completion E-mails"}
                    titleTypographyProps={{variant: "h6"}}
                    subheader={<Typography variant={"body2"}>
                      Please select the project and questionnaire in the form above!
                    </Typography>}
                    avatar={
                      <Avatar variant={"rounded"} sx={{backgroundColor: theme.palette.primary.main}}>
                        <MailRounded/>
                      </Avatar>}/>
        <CardActions>
          <Button onClick={() => handleSendCompletionMail().then()}>
            Send E-mails
          </Button>
        </CardActions>
      </Card></Grid>
    </Grid>;
}
