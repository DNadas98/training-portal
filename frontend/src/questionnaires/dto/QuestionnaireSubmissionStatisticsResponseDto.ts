export interface QuestionnaireSubmissionStatisticsResponseDto {
  questionnaireName: string;
  questionnaireMaxPoints: number;
  maxPointSubmissionId: number;
  maxPointSubmissionCreatedAt: string;
  maxPointSubmissionReceivedPoints: number;
  userId: number;
  username: string;
  fullName: string;
  email: string;
  currentCoordinatorFullName: string;
  currentDataPreparatorFullName: string;
  hasExternalTestQuestionnaire: boolean;
  hasExternalTestFailure: boolean;
  receivedSuccessfulCompletionEmail: boolean;
  submissionCount: number;
}
