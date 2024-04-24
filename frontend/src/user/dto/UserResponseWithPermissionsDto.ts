import {PermissionType} from "../../authentication/dto/PermissionType.ts";

export interface UserResponseWithPermissionsDto {
  readonly userId: number,
  readonly username: string,
  readonly fullName: string
  readonly permissions: PermissionType[]
}
