import {QuestionCreateRequestDto} from "./QuestionCreateRequestDto.ts";

export interface QuestionnaireCreateRequestDto {
  name: string;
  description: string;
  questions: QuestionCreateRequestDto[];
}