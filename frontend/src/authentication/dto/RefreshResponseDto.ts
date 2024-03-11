import {AuthenticationDto} from "./AuthenticationDto.ts";

export interface RefreshResponseDto {
  readonly newAuthentication?: AuthenticationDto;
  readonly error?: string;
}
