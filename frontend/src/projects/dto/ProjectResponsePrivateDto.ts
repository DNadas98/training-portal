export interface ProjectResponsePrivateDto {
  readonly groupId: number;
  readonly projectId: number;
  readonly name: string;
  readonly description: string;
  readonly startDate: Date;
  readonly deadline: Date;
}
