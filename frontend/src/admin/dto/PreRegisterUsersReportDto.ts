export interface PreRegisterUsersReportDto {
  totalUsers: number;
  updatedUsers: PreRegisterUserInternalDto[];
  createdUsers: PreRegisterUserInternalDto[];
  failedUsers: Map<PreRegisterUserInternalDto, string>;
}

interface PreRegisterUserInternalDto {
  username: string;
  fullName:string;
  email: string;
}
