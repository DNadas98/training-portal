import {SubmittedQuestionRequestDto} from "./SubmittedQuestionRequestDto.ts";

export interface QuestionnaireSubmissionRequestDto {
  questionnaireId: string;
  questions: SubmittedQuestionRequestDto[];
}
