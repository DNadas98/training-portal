import {Box, Button, Stack, TextField} from "@mui/material";
import useLocalized from "../../../../common/localization/hooks/useLocalized.tsx";

interface PasswordUpdateFormProps {
  handleUserPasswordUpdate: (event: any) => Promise<void>;
}

export default function PasswordUpdateForm(props: PasswordUpdateFormProps) {
  const localized = useLocalized();
  return (<Box sx={{padding: 2}} component={"form"} onSubmit={props.handleUserPasswordUpdate}>
    <Stack spacing={2}>
      <TextField name={"password"}
                 type={"password"}
                 label={localized("inputs.current_password")}
                 required
                 inputProps={{minLength: 8, maxLength: 50}}/>
      <TextField name={"newPassword"}
                 type={"password"}
                 label={localized("inputs.new_password")}
                 required/>
      <TextField name={"confirmNewPassword"}
                 type={"password"}
                 label={localized("inputs.confirm_new_password")}
                 required/>
      <Stack direction={"row"} spacing={2}>
        <Button type={"submit"} sx={{maxWidth: "fit-content"}} variant={"outlined"}>
          {localized("pages.user.profile.change_password")}
        </Button>
      </Stack>
    </Stack>
  </Box>)
}
