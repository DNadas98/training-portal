import {TextField} from "@mui/material";

interface TaskNameInputProps {
  name?: string;
}

export default function TaskNameInput(props: TaskNameInputProps) {
  return (

    <TextField variant={"outlined"}
               color={"secondary"}
               label={"Task name"}
               name={"name"}
               defaultValue={props?.name ?? ""}
               type={"text"}
               autoFocus={true}
               required
               inputProps={{
                 minLength: 1,
                 maxLength: 50
               }}/>
  )
}
