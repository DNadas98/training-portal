import {TextField} from "@mui/material";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";

export default function FullNameInput() {
  const localized=useLocalized();
  return (
    <TextField variant={"outlined"}
               color={"secondary"}
               label={localized("inputs.fullName")}
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
