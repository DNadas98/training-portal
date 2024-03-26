import {SubmittedAnswerStatus} from "./SubmittedAnswerStatus.ts";

export interface SubmittedAnswerResponseDto {
  id: number;
  text: string;
  order: number;
  status: SubmittedAnswerStatus
}
