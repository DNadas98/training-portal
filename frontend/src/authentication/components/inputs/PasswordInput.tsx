import {TextField} from "@mui/material";

interface PasswordInputProps {
  confirm?: boolean
}

export default function PasswordInput({confirm}: PasswordInputProps) {
  return (
    <TextField variant={"outlined"}
               color={"secondary"}
               label={confirm ? "Confirm password" : "Password"}
               name={confirm ? "confirmPassword" : "password"}
               type={"password"}
               required
               autoComplete={confirm ? "" : "current-password"}
               inputProps={{
                 minLength: 8,
                 maxLength: 50
               }}/>
  )
}
