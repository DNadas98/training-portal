import {PermissionType} from "../dto/PermissionType.ts";

export interface IPermissionContext {
  loading: boolean;
  groupPermissions: PermissionType[];
  projectPermissions: PermissionType[];
  taskPermissions: PermissionType[];
}
