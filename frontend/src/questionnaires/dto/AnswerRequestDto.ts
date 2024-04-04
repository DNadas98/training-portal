import {v4 as uuidv4} from "uuid";
export interface AnswerRequestDto {
  order:number;
  tempId:uuidv4;
  text: string;
  correct: boolean;
}
