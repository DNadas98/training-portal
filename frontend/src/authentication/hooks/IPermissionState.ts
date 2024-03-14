import {PermissionType} from "../dto/PermissionType.ts";

export interface IPermissionState {
  loading: boolean;
  groupPermissions: PermissionType[];
  projectPermissions: PermissionType[];
  taskPermissions: PermissionType[];
}
