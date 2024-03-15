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
      if (!isValidId(groupId)||!isValidId(projectId)) {
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

  function handleQuestionnairesClick() {
    navigate(`/groups/${groupId}/projects/${projectId}/editor/questionnaires`);
  }

  if (permissionsLoading || projectLoading) {
    return <LoadingSpinner/>;
  } else if ((!projectPermissions?.length) || !project) {
    handleErrorNotification(projectError ?? "Access Denied: Insufficient permissions");
    navigate(`/groups/${groupId}/projects`, {replace: true});
    return <></>;
  }
  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <p>Start date: {project.startDate.toString()}</p>
      <p>Deadline: {project.deadline.toString()}</p>
      <p>Project permissions: {projectPermissions.join(", ")}</p>
      {(projectPermissions.includes(PermissionType.PROJECT_EDITOR))
        && <div>
          <button onClick={handleQuestionnairesClick}>View questionnaires</button>
          <br/>
          <button onClick={handleTasksClick}>View tasks</button>
        </div>
      }
      {(projectPermissions.includes(PermissionType.PROJECT_ADMIN))
        && <div>
          <br/>
          <button onClick={handleJoinRequestClick}>View project join requests</button>
          <br/>
          <button onClick={() => {
            navigate(`/groups/${groupId}/projects/${projectId}/update`);
          }}>Update project details
          </button>
          <br/>
          <button onClick={handleDeleteClick}>Remove project</button>
        </div>
      }
      <br/>
      <button onClick={() => navigate(`/groups/${groupId}/projects`)}>Back</button>
    </div>
  );
}
