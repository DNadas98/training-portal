import {TextField} from "@mui/material";

export default function FullNameInput() {
  return (

    <TextField variant={"outlined"}
               color={"secondary"}
               label={"Full Name"}
               name={"fullName"}
               type={"text"}
               autoFocus={true}
               autoComplete={"name"}
               required
               inputProps={{
                 minLength: 1,
                 maxLength: 100
               }}/>
  )
}
