import {QuestionType} from "./QuestionType.ts";
import {AnswerCreateRequestDto} from "./AnswerCreateRequestDto.ts";

export interface QuestionCreateRequestDto {
  text: string;
  type: QuestionType;
  order: number;
  points: number;
  answers: AnswerCreateRequestDto[];
}
