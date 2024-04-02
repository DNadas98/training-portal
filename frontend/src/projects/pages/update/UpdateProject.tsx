import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {FormEvent, useEffect, useState} from "react";
import {ProjectCreateRequestDto} from "../../dto/ProjectCreateRequestDto.ts";
import {useNavigate, useParams} from "react-router-dom";
import {ProjectResponseDetailsDto} from "../../dto/ProjectResponseDetailsDto.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {ProjectUpdateRequestDto} from "../../dto/ProjectUpdateRequestDto.ts";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {PermissionType} from "../../../authentication/dto/PermissionType.ts";
import UpdateProjectForm from "./components/UpdateProjectForm.tsx";
import {isValidId} from "../../../common/utils/isValidId.ts";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";
import useSubmittedDate from "../../../common/dateTime/useSubmittedDate.tsx";

export default function UpdateProject() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const [projectLoading, setProjectLoading] = useState(true);
  const [project, setProject] = useState<ProjectResponseDetailsDto | undefined>(undefined);
  const [projectErrorStatus, setProjectError] = useState<string | undefined>(undefined);
  const toSubmittedDate = useSubmittedDate();

  const handleError = (error?: string) => {
    const defaultError = "An unknown error has occurred, please try again later";
    setProjectError(error ?? defaultError);
    handleErrorNotification(error ?? defaultError);
  };
  const handleErrorNotification = (message: string) => {
    notification.openNotification({
      type: "error",
      vertical: "top",
      horizontal: "center",
      message: message,
    });
  }

  async function loadProject() {
    try {
      setProjectLoading(true);
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setProjectError("The provided group or project ID is invalid");
        setProjectLoading(false);
        return
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/details`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        return handleError(response?.error);
      }
      const projectData = {
        ...response.data,
        startDate: new Date(response.data.startDate as string),
        deadline: new Date(response.data.deadline as string)
      }
      setProject(projectData as ProjectResponseDetailsDto);
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
      const detailedDescription = formData.get('detailedDescription') as string;
      if (!detailedDescription?.length) {
        handleErrorNotification("A detailed description of the project is required to proceed");
        return;
      }
      if (detailedDescription.length > 10000) {
        handleErrorNotification("Detailed description must be shorter than 10000 characters");
        return;
      }

      const startDate = toSubmittedDate(formData.get("startDate") as string);
      const deadline = toSubmittedDate(formData.get("deadline") as string);

      const requestDto: ProjectUpdateRequestDto = {
        name, description, detailedDescription, startDate, deadline
      };
      const response = await updateProject(requestDto);

      if (!response || response.error || response?.status > 399 || !response.data) {
        handleErrorNotification(response?.error ?? "Failed to update project");
        return;
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? "Project details updated successfully"
      });
      navigate(`/groups/${groupId}/projects/${projectId}/admin`);
    } catch (e) {
      handleErrorNotification("Failed to update project");
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
                            detailedDescription={project.detailedDescription}
                            startDate={project.startDate}
                            deadline={project.deadline}/>
}
