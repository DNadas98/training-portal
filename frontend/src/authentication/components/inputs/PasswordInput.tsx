import {BaseTextFieldProps, TextField} from "@mui/material";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";

interface PasswordInputProps {
  autoComplete?: BaseTextFieldProps["autoComplete"],
  confirm?: boolean
}

export default function PasswordInput(props: PasswordInputProps) {
  const getLocalized = useLocalized();
  return props.confirm
    ? <TextField variant={"outlined"}
                 color={"secondary"}
                 label={getLocalized("inputs.confirm_password")}
                 name={"confirmPassword"}
                 type={"password"}
                 
                 required
                 inputProps={{
                   autoComplete: "off",
                   minLength: 8,
                   maxLength: 50
                 }}/>
    : <TextField variant={"outlined"}
                 color={"secondary"}
                 label={getLocalized("inputs.password")}
                 name={"password"}
                 type={"password"}
                 required
                 autoComplete={props.autoComplete ?? "new-password"}
                 inputProps={{
                   autoComplete: "off",
                   minLength: 8,
                   maxLength: 50
                 }}/>
}
