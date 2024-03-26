import ProjectBrowser from "./components/ProjectBrowser.tsx";
import {useEffect, useMemo, useState} from "react";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {ProjectResponseDetailsDto} from "../../dto/ProjectResponseDetailsDto.ts";

export default function Projects() {
  const {loading: permissionsLoading, groupPermissions} = usePermissions();
  const groupId = useParams()?.groupId;
  const [projectsWithUserLoading, setProjectsWithUserLoading] = useState<boolean>(true);
  const [projectsWithUser, setProjectsWithUser] = useState<ProjectResponseDetailsDto[]>([]);
  const [projectsWithoutUserLoading, setProjectsWithoutUserLoading] = useState<boolean>(true);
  const [projectsWithoutUser, setProjectsWithoutUser] = useState<ProjectResponseDetailsDto[]>([]);

  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();

  async function loadProjectsWithUser() {
    try {
      setProjectsWithUserLoading(true);
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects?withUser=true`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to load your projects"}`
        })
        return;
      }
      const projectData = response.data.map(project => {
        return {
          ...project,
          startDate: new Date(project.startDate),
          deadline: new Date(project.deadline)
        }
      });
      setProjectsWithUser(projectData as ProjectResponseDetailsDto[]);
    } catch (e) {
      setProjectsWithUser([]);
    } finally {
      setProjectsWithUserLoading(false);
    }
  }

  async function loadProjectsWithoutUser() {
    try {
      setProjectsWithoutUserLoading(true);
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects?withUser=false`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to load projects to join"}`
        })
        return;
      }
      const projectData = response.data.map(project => {
        return {
          ...project,
          startDate: new Date(project.startDate),
          deadline: new Date(project.deadline)
        }
      });
      setProjectsWithoutUser(projectData as ProjectResponseDetailsDto[]);
    } catch (e) {
      setProjectsWithoutUser([]);
    } finally {
      setProjectsWithoutUserLoading(false);
    }
  }

  useEffect(() => {
    loadProjectsWithUser();
    loadProjectsWithoutUser();
  }, []);

  const [projectsWithUserFilterValue, setProjectsWithUserFilterValue] = useState<string>("");
  const [projectsWithoutUserFilterValue, setProjectsWithoutUserFilterValue] = useState<string>("");

  const projectsWithUserFiltered = useMemo(() => {
    if (!projectsWithUser?.length) {
      return [];
    }
    return projectsWithUser.filter(project => {
        return project.name.toLowerCase().includes(projectsWithUserFilterValue)
      }
    );
  }, [projectsWithUser, projectsWithUserFilterValue]);

  const projectsWithoutUserFiltered = useMemo(() => {
    if (!projectsWithoutUser?.length) {
      return [];
    }
    return projectsWithoutUser.filter(project => {
        return project.name.toLowerCase().includes(projectsWithoutUserFilterValue)
      }
    );
  }, [projectsWithoutUser, projectsWithoutUserFilterValue]);

  const handleProjectsWithUserSearch = (event: any) => {
    setProjectsWithUserFilterValue(event.target.value.toLowerCase().trim());
  };

  const handleProjectsWithoutUserSearch = (event: any) => {
    setProjectsWithoutUserFilterValue(event.target.value.toLowerCase().trim());
  };

  const [actionButtonDisabled, setActionButtonDisabled] = useState(false);

  async function sendProjectJoinRequest(projectId: number) {
    try {
      setActionButtonDisabled(true)
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/requests`, method: "POST"
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to send join request"}`
        });
        return;
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: "Your request to join the selected project was sent successfully"
      });
      await loadProjectsWithoutUser();
    } catch (e) {
      notification.openNotification({
        type: "error", vertical: "top", horizontal: "center",
        message: `Failed to send join request`
      })
    } finally {
      setActionButtonDisabled(false);
    }
  }

  const loadProjectDashboard = (projectId: number) => {
    navigate(`/groups/${groupId}/projects/${projectId}`);
  }

  const handleAddButtonClick = () => {
    navigate(`/groups/${groupId}/projects/create`);
  }

  if (permissionsLoading) {
    return <LoadingSpinner/>;
  } else if (!groupPermissions?.length) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: "Access Denied: Insufficient permissions"
    });
    navigate(`/groups/${groupId}`, {replace: true});
    return <></>;
  }
  return (
    <ProjectBrowser projectsWithUser={projectsWithUserFiltered}
                    projectsWithUserLoading={projectsWithUserLoading}
                    projectsWithoutUser={projectsWithoutUserFiltered}
                    projectsWithoutUserLoading={projectsWithoutUserLoading}
                    handleProjectsWithUserSearch={handleProjectsWithUserSearch}
                    handleProjectsWithoutUserSearch={handleProjectsWithoutUserSearch}
                    handleViewDashboardClick={loadProjectDashboard}
                    handleJoinRequestClick={sendProjectJoinRequest}
                    actionButtonDisabled={actionButtonDisabled}
                    handleAddButtonClick={handleAddButtonClick}
                    groupPermissions={groupPermissions}/>
  )
}
