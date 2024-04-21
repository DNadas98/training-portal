import {BaseTextFieldProps, TextField} from "@mui/material";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";

interface PasswordInputProps {
  autoComplete?: BaseTextFieldProps["autoComplete"],
  confirm?: boolean
}

export default function PasswordInput(props: PasswordInputProps) {
  const getLocalized = useLocalized();
  return (
    <TextField variant={"outlined"}
               color={"secondary"}
               label={props.confirm ? getLocalized("inputs.confirm_password") : getLocalized("inputs.password")}
               name={props.confirm ? "confirmPassword" : "password"}
               type={"password"}
               required
               autoComplete={props.autoComplete ?? ""}
               inputProps={{
                 minLength: 8,
                 maxLength: 50
               }}/>
  )
}
