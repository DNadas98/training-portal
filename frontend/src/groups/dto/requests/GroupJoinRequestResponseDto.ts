import {GroupResponsePublicDto} from "../GroupResponsePublicDto.ts";
import {
  UserResponsePublicDto
} from "../../../user/dto/UserResponsePublicDto.ts";
import {RequestStatus} from "../RequestStatus.ts";

export interface GroupJoinRequestResponseDto {
  readonly requestId: number;
  readonly group: GroupResponsePublicDto;
  readonly user: UserResponsePublicDto;
  readonly status: RequestStatus;
}
