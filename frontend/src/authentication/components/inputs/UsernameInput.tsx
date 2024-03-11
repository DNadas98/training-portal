import {TextField} from "@mui/material";

export default function UsernameInput() {
  return (

    <TextField variant={"outlined"}
               color={"secondary"}
               label={"Username"}
               name={"username"}
               type={"text"}
               autoFocus={true}
               autoComplete={"name"}
               required
               inputProps={{
                 minLength: 1,
                 maxLength: 50
               }}/>
  )
}
