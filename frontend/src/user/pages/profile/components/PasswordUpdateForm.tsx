import {Box, Button, Stack, TextField} from "@mui/material";

interface PasswordUpdateFormProps {
  handleUserPasswordUpdate: (event: any) => Promise<void>;
}

export default function PasswordUpdateForm(props: PasswordUpdateFormProps) {
  return (<Box sx={{padding: 2}} component={"form"} onSubmit={props.handleUserPasswordUpdate}>
    <Stack spacing={2}>
      <TextField name={"password"}
                 type={"password"}
                 label={"Current Password"}
                 required
                 inputProps={{minLength: 8, maxLength: 50}}/>
      <TextField name={"newPassword"}
                 type={"password"}
                 label={"(Optional) New Password"}
                 required/>
      <TextField name={"confirmNewPassword"}
                 type={"password"}
                 label={"(Optional) Confirm New Password"}
                 required/>
      <Stack direction={"row"} spacing={2}>
        <Button type={"submit"} sx={{maxWidth: "fit-content"}} variant={"outlined"}>
          Change Password
        </Button>
      </Stack>
    </Stack>
  </Box>)
}
