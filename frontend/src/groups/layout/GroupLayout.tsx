import {Outlet, useParams} from "react-router-dom";
import {Box} from "@mui/material";
import {useEffect, useState} from "react";
import {GroupResponsePublicDto} from "../dto/GroupResponsePublicDto.ts";
import GroupHeader from "./GroupHeader.tsx";
import UserFooter from "../../user/layout/UserFooter.tsx";
import {isValidId} from "../../common/utils/isValidId.ts";
import useAuthJsonFetch from "../../common/api/hooks/useAuthJsonFetch.tsx";
import {ProjectResponsePublicDto} from "../../projects/dto/ProjectResponsePublicDto.ts";
import usePermissions from "../../authentication/hooks/usePermissions.ts";

export default function GroupLayout() {
  const groupId = useParams()?.groupId;
  const [group, setGroup] = useState<GroupResponsePublicDto | undefined>(undefined);
  const projectId = useParams()?.projectId;
  const [project, setProject] = useState<ProjectResponsePublicDto | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const {loading: permissionsLoading, groupPermissions, projectPermissions} = usePermissions();

  async function loadGroup() {
    try {
      const response = await authJsonFetch({
        path: `groups/${groupId}`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setGroup(undefined);
        return;
      }
      setGroup(response.data as GroupResponsePublicDto);
    } catch (e) {
      setGroup(undefined);
    }
  }

  async function loadProject() {
    try {
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setProject(undefined);
        return;
      }
      const projectData = {
        ...response.data,
        startDate: new Date(response.data.startDate),
        deadline: new Date(response.data.deadline)
      };
      setProject((projectData as ProjectResponsePublicDto));
    } catch (e) {
      setProject(undefined);
    }
  }

  useEffect(() => {
    if (isValidId(groupId)) {
      loadGroup();
      if (isValidId(projectId)) {
        loadProject();
      } else {
        setProject(undefined);
      }
    } else {
      setGroup(undefined);
    }
  }, [groupId, projectId]);

  return (
    <Box sx={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
      <GroupHeader group={group} project={project} permissionsLoading={permissionsLoading}
                   groupPermissions={groupPermissions} projectPermissions={projectPermissions}/>
      <Box sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column"
      }}>
        <Box maxWidth={1300} alignSelf={"center"} justifySelf={"center"} width={"100%"}>
          <Outlet/>
        </Box>
      </Box>
      <UserFooter/>
    </Box>
  );
}
