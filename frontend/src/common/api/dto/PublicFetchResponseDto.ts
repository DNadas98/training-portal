import {ApiResponseDto} from "./ApiResponseDto.ts";

export interface PublicFetchResponseDto {
  httpResponse: Response,
  responseObject: ApiResponseDto
}
