export interface CompletionMailReportDto {
  totalUsers: number;
  successful: CompletionMailReportUserDto[];
  failed: Map<CompletionMailReportUserDto, string>;
}

interface CompletionMailReportUserDto {
  username: string;
  fullName: string;
  email: string;
}
