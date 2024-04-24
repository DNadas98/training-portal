import {GlobalRole} from "./GlobalRole.ts";

export interface UserInfoDto {
  readonly username: string;
  readonly email: string;
  readonly fullName: string;
  readonly roles: Array<GlobalRole>;
}
