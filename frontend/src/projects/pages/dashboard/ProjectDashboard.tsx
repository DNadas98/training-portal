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
} from "../../../authentication/dto/applicationUser/PermissionType.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {ProjectResponsePrivateDto} from "../../dto/ProjectResponsePrivateDto.ts";

export default function ProjectDashboard() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const dialog = useDialog();
  const companyId = useParams()?.companyId;
  const projectId = useParams()?.projectId;
  const [projectLoading, setProjectLoading] = useState(true);
  const [project, setProject] = useState<ProjectResponsePrivateDto | undefined>(undefined);
  const [projectError, setProjectError] = useState<string | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();

  const idIsValid = (id: string | undefined) => {
    return id && !isNaN(parseInt(id)) && parseInt(id) > 0
  };

  function handleErrorNotification(message?: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: `${message ?? "Failed to load project"}`
    });
  }

  async function loadProject() {
    try {
      setProjectLoading(true);
      if (!idIsValid(companyId) || !idIsValid(projectId)) {
        setProjectError("The provided company or project ID is invalid");
        setProjectLoading(false);
        return
      }
      const response = await authJsonFetch({
        path: `companies/${companyId}/projects/${projectId}`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setProjectError(response?.error ?? `Failed to load project`);
        return handleErrorNotification(response?.error);
      }
      const projectData = {
        ...response.data,
        startDate: new Date(response.data?.startDate),
        deadline: new Date(response.data?.deadline),
      }
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
      if (!idIsValid) {
        setProjectError("The provided company or project ID is invalid");
        setProjectLoading(false);
        return
      }
      const response = await authJsonFetch({
        path: `companies/${companyId}/projects/${projectId}`, method: "DELETE"
      });
      if (!response?.status || response.status > 404 || !response?.message) {
        return handleErrorNotification(response?.error ?? "Failed to remove project data");
      }

      setProject(undefined);
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? "All project data has been removed successfully"
      });
      navigate(`/companies/${companyId}`, {replace: true});
    } catch (e) {
      handleErrorNotification("Failed to remove project data");
    } finally {
      setProjectLoading(false);
    }
  }

  function handleDeleteClick() {
    dialog.openDialog({
      text: "Do you really wish to remove all project data, including all tasks and expenses?",
      confirmText: "Yes, delete this project", onConfirm: deleteProject
    });
  }

  function handleJoinRequestClick() {
    navigate(`/companies/${companyId}/projects/${projectId}/requests`);
  }

  function handleTasksClick() {
    navigate(`/companies/${companyId}/projects/${projectId}/tasks`);
  }

  if (permissionsLoading || projectLoading) {
    return <LoadingSpinner/>;
  } else if ((!projectPermissions?.length) || !project) {
    handleErrorNotification(projectError ?? "Access Denied: Insufficient permissions");
    navigate(`/companies/${companyId}/projects`, {replace: true});
    return <></>;
  }
  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <p>Start date: {project.startDate.toString()}</p>
      <p>Deadline: {project.deadline.toString()}</p>
      <p>Project permissions: {projectPermissions.join(", ")}</p>
      <button onClick={handleTasksClick}>View tasks</button>
      <br/>
      <button onClick={handleJoinRequestClick}>View project join requests</button>
      {(projectPermissions.includes(PermissionType.PROJECT_EDITOR))
        && <div>
              <button onClick={() => {
                navigate(`/companies/${companyId}/projects/${projectId}/update`);
              }}>Update project details
              </button>
          </div>
      }
      {(projectPermissions.includes(PermissionType.PROJECT_ADMIN))
        && <div>
              <button onClick={handleDeleteClick}>Remove project</button>
          </div>
      }
      <button onClick={() => navigate(`/companies/${companyId}/projects`)}>Back</button>
    </div>
  )
}
