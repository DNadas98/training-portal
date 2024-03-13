import {QuestionResponseEditorDto} from "./QuestionResponseEditorDto.ts";

export interface QuestionnaireResponseEditorDto {
  id: number;
  name: string;
  description: string;
  questions: QuestionResponseEditorDto[];
}