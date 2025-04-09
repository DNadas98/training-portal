import {TextField} from "@mui/material";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";

export default function EmailInput() {
  const getLocalized = useLocalized();
  return (
    <TextField variant={"outlined"}
               color={"secondary"}
               label={getLocalized("inputs.email")}
               name={"email"}
               type={"email"}
               inputProps={{
                 autoComplete: "off"
               }}
               required/>
  )
}
