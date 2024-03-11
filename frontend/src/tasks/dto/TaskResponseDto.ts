import {TaskStatus} from "./TaskStatus.ts";
import {Importance} from "./Importance.ts";

export interface TaskResponseDto {
  readonly projectId: number;
  readonly taskId: number;
  readonly name: string;
  readonly description: string;
  readonly importance: Importance;
  readonly difficulty: number;
  readonly startDate: Date;
  readonly deadline: Date;
  readonly taskStatus: TaskStatus;
}
