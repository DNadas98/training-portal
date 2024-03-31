import {QuestionnaireStatus} from "./QuestionnaireStatus.ts";
import {UserResponsePublicDto} from "../../user/dto/UserResponsePublicDto.ts";

export interface QuestionnaireResponseEditorDto {
  id: number;
  name: string;
  description: string;
  status: QuestionnaireStatus;
  maxPoints: number;
  createdBy: UserResponsePublicDto;
  createdAt: Date;
  updatedBy: UserResponsePublicDto;
  updatedAt: Date;
}
