import {plusHours} from "../../dateTime/plusHours.ts";
import CustomDateTimeInput from "./CustomDateTimeInput.tsx";
import useLocalized from "../../localization/hooks/useLocalized.tsx";

interface DeadlineInputProps {
  defaultValue?: Date;
}

export default function DeadlineInput(props: DeadlineInputProps) {
  const localized = useLocalized();
  return (
    <CustomDateTimeInput label={localized("inputs.deadline")} name={"deadline"}
                         defaultValue={props.defaultValue ?? plusHours(new Date(), 1)}/>
  )
}
