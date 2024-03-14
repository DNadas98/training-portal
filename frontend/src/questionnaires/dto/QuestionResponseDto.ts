import {QuestionType} from "./QuestionType.ts";
import {AnswerResponseDto} from "./AnswerResponseDto.ts";

export interface QuestionResponseDto {
  id: number;
  text: string;
  type: QuestionType;
  order: number;
  points: number;
  answers: AnswerResponseDto[];
}
