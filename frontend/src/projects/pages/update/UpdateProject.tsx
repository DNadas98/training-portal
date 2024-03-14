import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import {FormEvent, useEffect, useState} from "react";
import {ProjectCreateRequestDto} from "../../dto/ProjectCreateRequestDto.ts";
import {useNavigate, useParams} from "react-router-dom";
import {ProjectResponsePrivateDto} from "../../dto/ProjectResponsePrivateDto.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {ProjectUpdateRequestDto} from "../../dto/ProjectUpdateRequestDto.ts";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {
  PermissionType
} from "../../../authentication/dto/PermissionType.ts";
import UpdateProjectForm from "./components/UpdateProjectForm.tsx";

export default function UpdateProject() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const [projectLoading, setProjectLoading] = useState(true);
  const [project, setProject] = useState<ProjectResponsePrivateDto | undefined>(undefined);
  const [projectErrorStatus, setProjectError] = useState<string | undefined>(undefined);

  const handleError = (error?: string) => {
    const defaultError = "An unknown error has occurred, please try again later";
    setProjectError(error ?? defaultError);
    notification.openNotification({
      type: "error",
      vertical: "top",
      horizontal: "center",
      message: error ?? defaultError,
    });
  };

  const idIsValid = (id: string | undefined) => {
    return id && !isNaN(parseInt(id)) && parseInt(id) > 0
  };


  async function loadProject() {
    try {
      setProjectLoading(true);
      if (!idIsValid(groupId) || !idIsValid(projectId)) {
        setProjectError("The provided group or project ID is invalid");
        setProjectLoading(false);
        return
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        return handleError(response?.error);
      }
      const projectData = {
        ...response.data,
        startDate: new Date(response.data.startDate as string),
        deadline: new Date(response.data.deadline as string)
      }
      setProject(projectData as ProjectResponsePrivateDto);
    } catch (e) {
      setProject(undefined);
      setProjectError(`Failed to load project with ID ${projectId}`);
      handleError();
    } finally {
      setProjectLoading(false);
    }
  }

  useEffect(() => {
    loadProject().then();
  }, []);

  const updateProject = async (requestDto: ProjectCreateRequestDto) => {
    return await authJsonFetch({
      path: `groups/${groupId}/projects/${projectId}`,
      method: "PUT",
      body: requestDto
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      setProjectLoading(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const startDate = new Date(formData.get("startDate") as string).toISOString();
      const deadline = new Date(formData.get("deadline") as string).toISOString();

      const requestDto: ProjectUpdateRequestDto = {
        name,
        description,
        startDate,
        deadline
      };
      const response = await updateProject(requestDto);

      if (!response || response.error || response?.status > 399 || !response.data) {
        handleError(response?.error);
        return;
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? "Project details updated successfully"
      });
      navigate(`/groups/${groupId}/projects/${projectId}`);
    } catch (e) {
      handleError();
    } finally {
      setProjectLoading(false);
    }
  };
  if (permissionsLoading || projectLoading) {
    return <LoadingSpinner/>;
  } else if (!projectPermissions?.length
    || !projectPermissions.includes(PermissionType.PROJECT_ADMIN)
    || !project) {
    handleError(projectErrorStatus ?? "Access Denied: Insufficient permissions");
    navigate(`/groups/${groupId}/projects/${projectId}`, {replace: true});
    return <></>;
  }
  return <UpdateProjectForm onSubmit={handleSubmit}
                            name={project.name}
                            description={project.description}
                            startDate={project.startDate}
                            deadline={project.deadline}/>
}
