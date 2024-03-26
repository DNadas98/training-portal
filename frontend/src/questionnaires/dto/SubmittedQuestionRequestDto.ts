import {SubmittedAnswerRequestDto} from "./SubmittedAnswerRequestDto.ts";

export interface SubmittedQuestionRequestDto {
  questionId: number;
  checkedAnswers: SubmittedAnswerRequestDto[];
}
