import {TextField} from "@mui/material";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";

export default function UsernameInput() {
  const localized = useLocalized();
  return (
    <TextField variant={"outlined"}
               color={"secondary"}
               label={localized("inputs.username")}
               name={"username"}
               type={"text"}
               required
               inputProps={{
                 minLength: 1,
                 maxLength: 50,
                 autoComplete: "off"
               }}/>
  )
}
