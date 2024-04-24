export interface QuestionnaireSubmissionStatisticsResponseDto {
  questionnaireName: string;
  questionnaireMaxPoints: number;
  maxPointSubmissionId: number;
  maxPointSubmissionCreatedAt: string;
  maxPointSubmissionReceivedPoints: number;
  lastSubmissionId: number;
  lastSubmissionCreatedAt: string;
  lastSubmissionReceivedPoints: number;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  submissionCount: number;
}
