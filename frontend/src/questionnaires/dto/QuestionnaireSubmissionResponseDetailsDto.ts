import {SubmittedQuestionResponseDto} from "./SubmittedQuestionResponseDto.ts";

export interface QuestionnaireSubmissionResponseDetailsDto {
  id: number;
  name: string;
  description: string;
  receivedPoints: number;
  maxPoints: number;
  createdAt: string;
  questions: SubmittedQuestionResponseDto[];
}
