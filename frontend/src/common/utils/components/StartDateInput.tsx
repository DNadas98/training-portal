import CustomDateTimeInput from "./CustomDateTimeInput.tsx";
import useLocalized from "../../localization/hooks/useLocalized.tsx";

interface StartDateInputProps {
  defaultValue?: Date;
}

export default function StartDateInput(props: StartDateInputProps) {
  const localized=useLocalized();
  return (
    <CustomDateTimeInput label={localized("inputs.start_date")} name={"startDate"}
                         defaultValue={props.defaultValue ?? new Date()}/>
  )
}
