import {PermissionType} from "../dto/applicationUser/PermissionType.ts";

export interface IPermissionState {
  loading: boolean;
  groupPermissions: PermissionType[];
  projectPermissions: PermissionType[];
  taskPermissions: PermissionType[];
}
