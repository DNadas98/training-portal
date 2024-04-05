export interface QuestionnaireSubmissionResponseDto {
  id: number;
  name: string;
  description: string;
  receivedPoints: number;
  maxPoints: number;
  createdAt: string;
}
