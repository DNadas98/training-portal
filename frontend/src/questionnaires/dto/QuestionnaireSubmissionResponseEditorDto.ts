import {SubmittedQuestionResponseDto} from "./SubmittedQuestionResponseDto.ts";
import {QuestionnaireStatus} from "./QuestionnaireStatus.ts";

export interface QuestionnaireSubmissionResponseEditorDto {
  id: number;
  name: string;
  description: string;
  questions: SubmittedQuestionResponseDto[];
  receivedPoints: number;
  maxPoints: number;
  createdAt: string;
  status: QuestionnaireStatus;
}
