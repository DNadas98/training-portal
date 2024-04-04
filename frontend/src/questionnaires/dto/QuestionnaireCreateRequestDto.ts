import {QuestionRequestDto} from "./QuestionRequestDto.ts";

export interface QuestionnaireCreateRequestDto {
  name: string;
  description: string;
  questions: QuestionRequestDto[];
}
