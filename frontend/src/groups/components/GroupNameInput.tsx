import {TextField} from "@mui/material";

interface GroupNameInputProps {
  name?: string;
}

export default function GroupNameInput(props: GroupNameInputProps) {
  return (

    <TextField variant={"outlined"}
               color={"secondary"}
               label={"Group name"}
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
