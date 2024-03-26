import {
  UserResponsePublicDto
} from "../../../user/dto/UserResponsePublicDto.ts";
import {ProjectResponsePublicDto} from "../ProjectResponsePublicDto.ts";
import {RequestStatus} from "../../../groups/dto/RequestStatus.ts";

export interface ProjectJoinRequestResponseDto {
  readonly requestId: number;
  readonly project: ProjectResponsePublicDto;
  readonly user: UserResponsePublicDto;
  readonly status: RequestStatus;
}
