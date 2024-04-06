import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {PermissionType} from "../../../authentication/dto/PermissionType.ts";
import {ProjectResponseDetailsDto} from "../../dto/ProjectResponseDetailsDto.ts";
import {isValidId} from "../../../common/utils/isValidId.ts";
import {Button, Card, CardActions, CardContent, CardHeader, Grid, Stack, Typography} from "@mui/material";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";
import useLocalizedDateTime from "../../../common/localization/hooks/useLocalizedDateTime.tsx";
import RichTextDisplay from "../../../common/richTextEditor/RichTextDisplay.tsx";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";

export default function ProjectDashboard() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const [projectLoading, setProjectLoading] = useState(true);
  const [project, setProject] = useState<ProjectResponseDetailsDto | undefined>(undefined);
  const [projectError, setProjectError] = useState<string | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const getLocalizedDateTime = useLocalizedDateTime();
  const dialog = useDialog();

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
        path: `groups/${groupId}/projects/${projectId}/details`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setProjectError(response?.error ?? `Failed to load project`);
        return handleErrorNotification(response?.error);
      }
      const projectData = {
        ...response.data,
        startDate: new Date(response.data.startDate as string),
        deadline: new Date(response.data.deadline as string)
      };
      setProject(projectData as ProjectResponseDetailsDto);
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

  function handleAssignedMembersClick() {
    navigate(`/groups/${groupId}/projects/${projectId}/members`);
  }

  function handleCoordinatorQuestionnairesClick() {
    navigate(`/groups/${groupId}/projects/${projectId}/coordinator/questionnaires`);
  }

  /*function handleTasksClick() {
    navigate(`/groups/${groupId}/projects/${projectId}/tasks`);
  }*/

  function handleEditorQuestionnairesClick() {
    navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`);
  }

  function handleUserQuestionnairesClick() {
    navigate(`/groups/${groupId}/projects/${projectId}/questionnaires`);
  }


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
      content: "Do you really wish to remove all project data, including all questionnaires and questionnaire submissions? This action is irreversible.",
      confirmText: "Yes, delete this project", onConfirm: deleteProject
    });
  }

  function handleJoinRequestClick() {
    navigate(`/groups/${groupId}/projects/${projectId}/requests`);
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
          <Stack spacing={2}>
            <RichTextDisplay content={project.detailedDescription}/>
            {/*<Typography gutterBottom>{project.description}</Typography>*/}
          </Stack>
          <Typography>
            Start Date: {getLocalizedDateTime(project.startDate)}
          </Typography>
          <Typography>
            Deadline: {getLocalizedDateTime(project.deadline)}
          </Typography>
        </CardContent>
        <CardActions> <Stack spacing={0.5}>
          <Button sx={{width: "fit-content", textAlign: "left"}} onClick={handleUserQuestionnairesClick}>
            View active questionnaires
          </Button>
          <Button sx={{width: "fit-content"}} onClick={() => navigate(`/groups/${groupId}/projects`)}>
            Back to projects
          </Button>
        </Stack></CardActions>
      </Card> </Grid>
      <Grid item xs={10}>
        <Grid container spacing={2} alignItems={"stretch"} justifyContent={"space-between"}>
          {(projectPermissions.includes(PermissionType.PROJECT_EDITOR))
            && <Grid item xs={12} md={true}><Card sx={{minHeight: "100%", minWidth: "100%"}}>
              <CardHeader title={"Editor Actions"} titleTypographyProps={{variant: "h6"}}/>
              <CardActions> <Stack spacing={0.5}>
                <Button sx={{width: "fit-content"}} onClick={handleEditorQuestionnairesClick}>
                  Edit questionnaires
                </Button>
                {/* <Button sx={{width: "fit-content"}} onClick={handleTasksClick}>
              View tasks
            </Button>*/}
              </Stack></CardActions>
            </Card> </Grid>
          }
          {(projectPermissions.includes(PermissionType.PROJECT_COORDINATOR))
            && <Grid item xs={12} md={true}><Card sx={{minHeight: "100%", minWidth: "100%"}}>
              <CardHeader title={"Coordinator Actions"} titleTypographyProps={{variant: "h6"}}/>
              <CardActions> <Stack spacing={0.5}>
                <Button sx={{width: "fit-content", textAlign: "left"}} onClick={handleCoordinatorQuestionnairesClick}>
                  View questionnaire Statistics
                </Button>
              </Stack></CardActions>
            </Card> </Grid>
          }
          {(projectPermissions.includes(PermissionType.PROJECT_ADMIN))
            && <Grid item xs={12} md={true}><Card sx={{minHeight: "100%", minWidth: "100%"}}>
              <CardHeader title={"Administrator Actions"} titleTypographyProps={{variant: "h6"}}/>
              <CardActions>
                <Stack spacing={0.5}>
                  <Button sx={{width: "fit-content"}} onClick={handleJoinRequestClick}>
                    View Join Requests
                  </Button>
                  <Button sx={{width: "fit-content"}} onClick={handleAssignedMembersClick}>
                    View Assigned Members
                  </Button>
                  <Button sx={{width: "fit-content"}} onClick={() => {
                    navigate(`/groups/${groupId}/projects/${projectId}/update`);
                  }}>
                    Update Project Details
                  </Button>
                  <Button sx={{width: "fit-content"}} onClick={handleDeleteClick}>
                    Remove Project
                  </Button>
                </Stack>
              </CardActions></Card></Grid>
          }
        </Grid>
      </Grid>
    </Grid>
  );
}
