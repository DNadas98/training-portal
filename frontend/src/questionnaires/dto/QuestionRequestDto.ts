import {QuestionType} from "./QuestionType.ts";
import {AnswerRequestDto} from "./AnswerRequestDto.ts";
import {v4 as uuidv4} from "uuid";

export interface QuestionRequestDto {
  tempId:uuidv4;
  order: number;
  text: string;
  type: QuestionType;
  points: number;
  answers: AnswerRequestDto[];
}
