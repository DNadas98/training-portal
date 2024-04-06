export interface QuestionnaireSubmissionResponseAdminDto {
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
  submissionCount: number;
}
