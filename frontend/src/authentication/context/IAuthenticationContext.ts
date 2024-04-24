import {AuthenticationDto} from "../dto/AuthenticationDto.ts";
import {GlobalRole} from "../dto/userInfo/GlobalRole.ts";

export interface IAuthenticationContext {
  authenticate: (authentication: AuthenticationDto) => void;
  logout: () => void;
  getUsername: () => string | undefined;
  getFullName: () => string | undefined;
  getEmail: () => string | undefined;
  getRoles: () => Array<GlobalRole> | undefined;
  getAccessToken: () => string | undefined;
}
