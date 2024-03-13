import {QuestionType} from "./QuestionType.ts";
import {AnswerResponseEditorDto} from "./AnswerResponseEditorDto.ts";

export interface QuestionResponseEditorDto {
  id: number;
  text: string;
  type: QuestionType;
  order: number;
  points: number;
  answers: AnswerResponseEditorDto[];
}
