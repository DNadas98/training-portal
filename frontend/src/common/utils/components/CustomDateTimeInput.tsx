import {MobileDateTimePicker} from "@mui/x-date-pickers";

interface CustomDateTimeInputProps {
  name: string;
  label: string;
  defaultValue?: Date;
}

export default function CustomDateTimeInput(props: CustomDateTimeInputProps) {
  return (
    <MobileDateTimePicker
      label={props.label}
      name={props.name}
      defaultValue={props.defaultValue ?? new Date()}
      timezone={"system"}
    />
  )
}
