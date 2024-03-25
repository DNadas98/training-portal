import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {
  PermissionType
} from "../../../authentication/dto/PermissionType.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {ProjectResponsePrivateDto} from "../../dto/ProjectResponsePrivateDto.ts";
import {isValidId} from "../../../common/utils/isValidId.ts";
import {Button, Card, CardActions, CardContent, CardHeader, Grid, Stack, Typography} from "@mui/material";

export default function ProjectDashboard() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const dialog = useDialog();
  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const [projectLoading, setProjectLoading] = useState(true);
  const [project, setProject] = useState<ProjectResponsePrivateDto | undefined>(undefined);
  const [projectError, setProjectError] = useState<string | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();

  function handleErrorNotification(message?: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: `${message ?? "Failed to load project"}`
    });
  }

  async function loadProject() {
    try {
      setProjectLoading(true);
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setProjectError("The provided group or project ID is invalid");
        setProjectLoading(false);
        return;
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setProjectError(response?.error ?? `Failed to load project`);
        return handleErrorNotification(response?.error);
      }
      // @ts-ignore
      const projectData = {
        ...response.data,
        startDate: new Date(response.data.startDate as string),
        deadline: new Date(response.data.deadline as string)
      };
      setProject(projectData as ProjectResponsePrivateDto);
    } catch (e) {
      setProject(undefined);
      setProjectError("Failed to load project");
      handleErrorNotification();
    } finally {
      setProjectLoading(false);
    }
  }

  useEffect(() => {
    loadProject().then();
  }, []);

  async function deleteProject() {
    try {
      setProjectLoading(true);
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setProjectError("The provided group or project ID is invalid");
        setProjectLoading(false);
        return;
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}`, method: "DELETE"
      });
      if (!response?.status || response.status > 404 || !response?.message) {
        return handleErrorNotification(response?.error ?? "Failed to remove project data");
      }

      setProject(undefined);
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? "All project data has been removed successfully"
      });
      navigate(`/groups/${groupId}`, {replace: true});
    } catch (e) {
      handleErrorNotification("Failed to remove project data");
    } finally {
      setProjectLoading(false);
    }
  }

  function handleDeleteClick() {
    dialog.openDialog({
      text: "Do you really wish to remove all project data, including all tasks?",
      confirmText: "Yes, delete this project", onConfirm: deleteProject
    });
  }

  function handleJoinRequestClick() {
    navigate(`/groups/${groupId}/projects/${projectId}/requests`);
  }

  function handleTasksClick() {
    navigate(`/groups/${groupId}/projects/${projectId}/tasks`);
  }

  function handleEditorQuestionnairesClick() {
    navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`);
  }

  function handleUserQuestionnairesClick() {
    navigate(`/groups/${groupId}/projects/${projectId}/questionnaires`);
  }

  if (permissionsLoading || projectLoading) {
    return <LoadingSpinner/>;
  } else if ((!projectPermissions?.length) || !project) {
    handleErrorNotification(projectError ?? "Access Denied: Insufficient permissions");
    navigate(`/groups/${groupId}/projects`, {replace: true});
    return <></>;
  }

  return (
    <Grid container justifyContent={"center"} alignItems={"center"} spacing={2}>
      <Grid item xs={10}><Card>
        <CardHeader title={project.name}/>
        <CardContent>
          <Typography gutterBottom>
            {project.description}
          </Typography>
          <Typography>
            Start Date: {project.startDate.toLocaleString()}
          </Typography>
          <Typography>
            Deadline: {project.startDate.toLocaleString()}
          </Typography>
        </CardContent>
        <CardActions> <Stack spacing={0.5}>
          <Button sx={{width: "fit-content"}} onClick={handleUserQuestionnairesClick}>
            View active questionnaires
          </Button>
          <Button sx={{width: "fit-content"}} onClick={() => navigate(`/groups/${groupId}/projects`)}>
            Back to company
          </Button>
        </Stack></CardActions>
      </Card> </Grid>
      {(projectPermissions.includes(PermissionType.PROJECT_EDITOR))
        && <Grid item xs={10}><Card>
          <CardHeader title={"Project Editor Actions"} titleTypographyProps={{variant: "h6"}}/>
          <CardActions> <Stack spacing={0.5}>
            <Button sx={{width: "fit-content"}} onClick={handleEditorQuestionnairesClick}>
              View all questionnaires
            </Button>
            <Button sx={{width: "fit-content"}} onClick={handleTasksClick}>
              View tasks
            </Button>
          </Stack></CardActions>
        </Card> </Grid>
      }
      {(projectPermissions.includes(PermissionType.PROJECT_ADMIN))
        && <Grid item xs={10}><Card>
          <CardHeader title={"Project Administrator Actions"} titleTypographyProps={{variant: "h6"}}/>
          <CardActions> <Stack spacing={0.5}>
            <Button sx={{width: "fit-content"}} onClick={handleJoinRequestClick}>
              View project join requests
            </Button>
            <Button sx={{width: "fit-content"}} onClick={() => {
              navigate(`/groups/${groupId}/projects/${projectId}/update`);
            }}>
              Update project details
            </Button>
            <Button sx={{width: "fit-content"}} onClick={handleDeleteClick}>
              Remove project
            </Button>
          </Stack></CardActions>
        </Card> </Grid>
      }
    </Grid>
  );
}
