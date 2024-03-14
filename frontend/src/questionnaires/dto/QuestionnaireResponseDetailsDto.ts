import {QuestionResponseDto} from "./QuestionResponseDto.ts";

export interface QuestionnaireResponseDetailsDto {
  id: number;
  name: string;
  description: string;
  questions: QuestionResponseDto[];
}
