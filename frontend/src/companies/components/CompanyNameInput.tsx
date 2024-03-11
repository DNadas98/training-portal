import {TextField} from "@mui/material";

interface CompanyNameInputProps {
  name?: string;
}

export default function CompanyNameInput(props: CompanyNameInputProps) {
  return (

    <TextField variant={"outlined"}
               color={"secondary"}
               label={"Company name"}
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
