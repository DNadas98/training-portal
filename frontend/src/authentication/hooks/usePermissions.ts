import {PermissionType} from "../dto/applicationUser/PermissionType.ts";
import {useParams} from "react-router-dom";
import {useAuthJsonFetch} from "../../common/api/service/apiService.ts";
import {useEffect, useState} from "react";
import {IPermissionState} from "./IPermissionState.ts";

export default function usePermissions() {
  const params = useParams();
  const companyId = params.companyId;
  const projectId = params.projectId;
  const taskId = params.taskId;
  const authJsonFetch = useAuthJsonFetch();

  function isValidId(id: string | undefined) {
    return id && !isNaN(parseInt(id)) && parseInt(id) > 0;
  }

  const [companyPermissionsLoading, setCompanyPermissionsLoading] = useState<boolean>(true);
  const [companyPermissions, setCompanyPermissions] = useState<PermissionType[]>([]);
  const [projectPermissionsLoading, setProjectPermissionsLoading] = useState<boolean>(true);
  const [projectPermissions, setProjectPermissions] = useState<PermissionType[]>([]);
  const [taskPermissionsLoading, setTaskPermissionsLoading] = useState<boolean>(true);
  const [taskPermissions, setTaskPermissions] = useState<PermissionType[]>([]);


  const loading = companyPermissionsLoading || projectPermissionsLoading || taskPermissionsLoading;

  async function loadCompanyPermissions(): Promise<void> {
    try {
      if (!isValidId(companyId)) {
        setCompanyPermissions([]);
        return;
      }
      setCompanyPermissionsLoading(true);
      const response = await authJsonFetch({path: `user/permissions/companies/${companyId}`});
      if (!response || !response?.data || response?.error || response?.status > 399) {
        setCompanyPermissions([]);
        return;
      }
      setCompanyPermissions(response.data as PermissionType[]);
    } catch (e) {
      setCompanyPermissions([]);
    } finally {
      setCompanyPermissionsLoading(false);
    }
  }

  async function loadProjectPermissions(): Promise<void> {
    try {
      if (!isValidId(companyId) || !isValidId(projectId)) {
        setProjectPermissions([]);
        return;
      }
      setProjectPermissionsLoading(true);
      const response = await authJsonFetch({path: `user/permissions/companies/${companyId}/projects/${projectId}`});
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
      if (!isValidId(companyId) || !isValidId(projectId) || !isValidId(taskId)) {
        setTaskPermissions([]);
        return;
      }
      setTaskPermissionsLoading(true);
      const response = await authJsonFetch({path: `user/permissions/companies/${companyId}/projects/${projectId}/tasks/${taskId}`});
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
    loadCompanyPermissions().then();
  }, [companyId]);

  useEffect(() => {
    loadProjectPermissions().then();
  }, [projectId]);

  useEffect(() => {
    loadTaskPermissions().then();
  }, [taskId]);

  return {
    loading,
    companyPermissions,
    projectPermissions,
    taskPermissions,
  } as IPermissionState;
}
