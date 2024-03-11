import {plusHours} from "../../dateTime/dateTimeService.ts";
import CustomDateTimeInput from "./CustomDateTimeInput.tsx";

interface DeadlineInputProps {
  defaultValue?: Date;
}

export default function DeadlineInput(props: DeadlineInputProps) {
  return (
    <CustomDateTimeInput label={"Deadline"} name={"deadline"}
                         defaultValue={props.defaultValue ?? plusHours(new Date(), 1)}/>
  )
}
