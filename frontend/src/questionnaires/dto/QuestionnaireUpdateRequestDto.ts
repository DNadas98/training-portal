import {QuestionRequestDto} from "./QuestionRequestDto.ts";
import {QuestionnaireStatus} from "./QuestionnaireStatus.ts";

export interface QuestionnaireUpdateRequestDto {
  name: string;
  description: string;
  status: QuestionnaireStatus;
  questions: QuestionRequestDto[];
}
