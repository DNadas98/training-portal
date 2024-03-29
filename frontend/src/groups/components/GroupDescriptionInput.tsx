import {TextField} from "@mui/material";

interface GroupDescriptionInputProps {
  description?: string;
}

export default function GroupDescriptionInput(props: GroupDescriptionInputProps) {
  return (
    <TextField name={"description"} defaultValue={props.description ?? ""}
               placeholder={"Short Description, max 255 characters"}
               multiline inputProps={{minLength: 1, maxLength: 255}} minRows={1}/>
  )
}
