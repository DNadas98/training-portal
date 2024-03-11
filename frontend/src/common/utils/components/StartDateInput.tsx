import CustomDateTimeInput from "./CustomDateTimeInput.tsx";

interface StartDateInputProps {
  defaultValue?: Date;
}

export default function StartDateInput(props: StartDateInputProps) {
  return (
    <CustomDateTimeInput label={"Start Date"} name={"startDate"}
                         defaultValue={props.defaultValue ?? new Date()}/>
  )
}
