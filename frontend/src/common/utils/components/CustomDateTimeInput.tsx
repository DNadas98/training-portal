import {DateTimePicker} from "@mui/x-date-pickers";

interface CustomDateTimeInputProps {
  name: string;
  label: string;
  defaultValue?: Date;
}

export default function CustomDateTimeInput(props: CustomDateTimeInputProps) {
  return (
    <DateTimePicker
      label={props.label}
      name={props.name}
      defaultValue={props.defaultValue ?? new Date()}
      timezone={"system"}
      timeSteps={{minutes: 1}}
      ampm={false}
      ampmInClock={false}
    />
  )
}
