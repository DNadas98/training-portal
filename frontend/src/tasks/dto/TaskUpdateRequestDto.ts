import {TaskStatus} from "./TaskStatus.ts";
import {Importance} from "./Importance.ts";

export interface TaskUpdateRequestDto {
  readonly name: string;
  readonly description: string;
  readonly importance: Importance;
  readonly difficulty: number;
  readonly startDate: string;
  readonly deadline: string;
  readonly taskStatus: TaskStatus;
}
