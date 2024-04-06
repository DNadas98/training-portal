import {PermissionType} from "../dto/PermissionType.ts";
import {Outlet, useParams} from "react-router-dom";
import {createContext, useEffect, useState} from "react";
import useAuthJsonFetch from "../../common/api/hooks/useAuthJsonFetch.tsx";
import {isValidId} from "../../common/utils/isValidId.ts";
import {IPermissionContext} from "./IPermissionContext.ts";

export const PermissionContext = createContext<IPermissionContext>({
  loading: true,
  groupPermissions: [],
  projectPermissions: [],
  taskPermissions: []
})

export default function PermissionProvider() {
  const params = useParams();
  const groupId = params.groupId;
  const projectId = params.projectId;
  const taskId = params.taskId;
  const authJsonFetch = useAuthJsonFetch();

  const [groupPermissionsLoading, setGroupPermissionsLoading] = useState<boolean>(true);
  const [groupPermissions, setGroupPermissions] = useState<PermissionType[]>([]);
  const [projectPermissionsLoading, setProjectPermissionsLoading] = useState<boolean>(true);
  const [projectPermissions, setProjectPermissions] = useState<PermissionType[]>([]);
  const [taskPermissionsLoading, setTaskPermissionsLoading] = useState<boolean>(true);
  const [taskPermissions, setTaskPermissions] = useState<PermissionType[]>([]);


  const loading = groupPermissionsLoading || projectPermissionsLoading || taskPermissionsLoading;

  async function loadGroupPermissions(): Promise<void> {
    try {
      if (!isValidId(groupId)) {
        setGroupPermissions([]);
        return;
      }
      setGroupPermissionsLoading(true);
      const response = await authJsonFetch({path: `user/permissions/groups/${groupId}`});
      if (!response || !response?.data || response?.error || response?.status > 399) {
        setGroupPermissions([]);
        return;
      }
      setGroupPermissions(response.data as PermissionType[]);
    } catch (e) {
      setGroupPermissions([]);
    } finally {
      setGroupPermissionsLoading(false);
    }
  }

  async function loadProjectPermissions(): Promise<void> {
    try {
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setProjectPermissions([]);
        return;
      }
      setProjectPermissionsLoading(true);
      const response = await authJsonFetch({path: `user/permissions/groups/${groupId}/projects/${projectId}`});
      if (!response || !response?.data || response?.error || response?.status > 399) {
        setProjectPermissions([]);
        return;
      }
      setProjectPermissions(response.data as PermissionType[]);
    } catch (e) {
      setProjectPermissions([]);
    } finally {
      setProjectPermissionsLoading(false);
    }
  }

  async function loadTaskPermissions(): Promise<void> {
    try {
      if (!isValidId(groupId) || !isValidId(projectId) || !isValidId(taskId)) {
        setTaskPermissions([]);
        return;
      }
      setTaskPermissionsLoading(true);
      const response = await authJsonFetch({path: `user/permissions/groups/${groupId}/projects/${projectId}/tasks/${taskId}`});
      if (!response || !response?.data || response?.error || response?.status > 399) {
        setTaskPermissions([]);
        return;
      }
      setTaskPermissions(response.data as PermissionType[]);
    } catch (e) {
      setTaskPermissions([]);
      return;
    } finally {
      setTaskPermissionsLoading(false);
    }
  }

  useEffect(() => {
    loadGroupPermissions().then();
  }, [groupId]);

  useEffect(() => {
    loadProjectPermissions().then();
  }, [projectId]);

  useEffect(() => {
    loadTaskPermissions().then();
  }, [taskId]);

  return <PermissionContext.Provider value={{loading, groupPermissions, projectPermissions, taskPermissions}}>
    <Outlet/>
  </PermissionContext.Provider>
}
