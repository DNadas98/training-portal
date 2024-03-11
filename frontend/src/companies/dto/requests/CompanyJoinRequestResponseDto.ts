import {CompanyResponsePublicDto} from "../CompanyResponsePublicDto.ts";
import {
  UserResponsePublicDto
} from "../../../authentication/dto/applicationUser/UserResponsePublicDto.ts";
import {RequestStatus} from "../RequestStatus.ts";

export interface CompanyJoinRequestResponseDto {
  readonly requestId: number;
  readonly company: CompanyResponsePublicDto;
  readonly user: UserResponsePublicDto;
  readonly status: RequestStatus;
}
