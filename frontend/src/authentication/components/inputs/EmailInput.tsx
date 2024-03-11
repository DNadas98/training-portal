import {TextField} from "@mui/material";

export default function EmailInput() {
  return (
    <TextField variant={"outlined"}
               color={"secondary"}
               label={"E-mail address"}
               name={"email"}
               type={"email"}
               autoComplete={"email"}
               required/>
  )
}
