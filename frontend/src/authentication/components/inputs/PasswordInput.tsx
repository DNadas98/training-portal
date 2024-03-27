import {TextField} from "@mui/material";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";

interface PasswordInputProps {
  confirm?: boolean
}

export default function PasswordInput({confirm}: PasswordInputProps) {
  const getLocalized=useLocalized();
  return (
    <TextField variant={"outlined"}
               color={"secondary"}
               label={confirm ? getLocalized("inputs.confirm_password") : getLocalized("inputs.password")}
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
