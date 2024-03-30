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

  function handleAdminDashboardClick() {
    navigate(`/groups/${groupId}/projects/${projectId}/admin`);
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
          <Button sx={{width: "fit-content", textAlign:"left"}} onClick={handleUserQuestionnairesClick}>
            View active questionnaires
          </Button>
          <Button sx={{width: "fit-content"}} onClick={() => navigate(`/groups/${groupId}/projects`)}>
            Back to projects
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
           {/* <Button sx={{width: "fit-content"}} onClick={handleTasksClick}>
              View tasks
            </Button>*/}
          </Stack></CardActions>
        </Card> </Grid>
      }
      {(projectPermissions.includes(PermissionType.PROJECT_ADMIN))
        && <Grid item xs={10}><Card><CardActions>
          <Button sx={{width: "fit-content"}} onClick={handleAdminDashboardClick}>
            View admin dashboard
          </Button>
        </CardActions></Card></Grid>
      }
    </Grid>
  );
}
