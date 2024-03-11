import {GlobalRole} from "./GlobalRole.ts";
import {AccountType} from "../userAccount/AccountType.ts";

export interface UserInfoDto {
  readonly username: string;
  readonly email: string;
  readonly roles: Array<GlobalRole>;
  readonly accountType:AccountType;
}
