import {
  UserResponsePublicDto
} from "../../../user/dto/UserResponsePublicDto.ts";
import {RequestStatus} from "../RequestStatus.ts";
import {ProjectResponsePublicDto} from "../ProjectResponsePublicDto.ts";

export interface ProjectJoinRequestResponseDto {
  readonly requestId: number;
  readonly project: ProjectResponsePublicDto;
  readonly user: UserResponsePublicDto;
  readonly status: RequestStatus;
}
