import {QuestionType} from "./QuestionType.ts";
import {SubmittedAnswerResponseDto} from "./SubmittedAnswerResponseDto.ts";

export interface SubmittedQuestionResponseDto {
  id: number;
  text: string;
  type: QuestionType;
  receivedPoints: number;
  maxPoints: number;
  order: number;
  answers: SubmittedAnswerResponseDto[];
}
