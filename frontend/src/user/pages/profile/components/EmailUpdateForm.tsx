import {Box, Button, Stack, TextField} from "@mui/material";

interface EmailUpdateFormProps {
  handleUserEmailUpdate: (event: any) => Promise<void>;
}

export default function EmailUpdateForm(props: EmailUpdateFormProps) {
  return (<Box sx={{padding: 2}} component={"form"} onSubmit={props.handleUserEmailUpdate}>
    <Stack spacing={2}>
      <TextField name={"email"}
                 type={"email"}
                 label={"New E-mail address"}
                 required
                 inputProps={{minLength: 1, maxLength: 50}}/>
      <TextField name={"password"}
                 type={"password"}
                 label={"Current Password"}
                 required
                 inputProps={{minLength: 8, maxLength: 50}}/>
      <Stack direction={"row"} spacing={2}>
        <Button type={"submit"} sx={{maxWidth: "fit-content"}} variant={"outlined"}>
          Change E-mail Address
        </Button>
      </Stack>
    </Stack>
  </Box>)
}
