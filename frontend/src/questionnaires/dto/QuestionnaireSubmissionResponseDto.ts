import {SubmittedQuestionResponseDto} from "./SubmittedQuestionResponseDto.ts";

export interface QuestionnaireSubmissionResponseDto {
  id: number;
  name: string;
  description: string;
  questions: SubmittedQuestionResponseDto[];
  receivedPoints: number;
  maxPoints: number;
  createdAt: string;
}
