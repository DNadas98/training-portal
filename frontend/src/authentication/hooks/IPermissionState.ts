import {PermissionType} from "../dto/applicationUser/PermissionType.ts";

export interface IPermissionState {
  loading: boolean;
  companyPermissions: PermissionType[];
  projectPermissions: PermissionType[];
  taskPermissions: PermissionType[];
}
