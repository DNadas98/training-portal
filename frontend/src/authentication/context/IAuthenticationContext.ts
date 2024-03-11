import {AuthenticationDto} from "../dto/AuthenticationDto.ts";
import {GlobalRole} from "../dto/userInfo/GlobalRole.ts";
import {AccountType} from "../dto/userAccount/AccountType.ts";

export interface IAuthenticationContext {
  authenticate: (authentication: AuthenticationDto) => void;
  logout: () => void;
  getUsername: () => string | undefined;
  getEmail: () => string | undefined;
  getRoles: () => Array<GlobalRole> | undefined;
  getAccountType: () => AccountType | undefined;
  getAccessToken: () => string | undefined;
}
