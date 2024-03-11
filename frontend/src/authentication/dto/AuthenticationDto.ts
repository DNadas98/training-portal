import {UserInfoDto} from "./userInfo/UserInfoDto.ts";

export interface AuthenticationDto {
  readonly userInfo?: UserInfoDto,
  readonly accessToken?: string
}
