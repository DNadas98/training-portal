import {QuestionnaireStatus} from "./QuestionnaireStatus.ts";

export interface QuestionnaireSubmissionResponseEditorDto {
  id: number;
  name: string;
  description: string;
  receivedPoints: number;
  maxPoints: number;
  createdAt: string;
  status: QuestionnaireStatus;
}
