import {TextField} from "@mui/material";

interface ProjectNameInputProps {
  name?: string;
}

export default function ProjectNameInput(props: ProjectNameInputProps) {
  return (

    <TextField variant={"outlined"}
               color={"secondary"}
               label={"Project name"}
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
