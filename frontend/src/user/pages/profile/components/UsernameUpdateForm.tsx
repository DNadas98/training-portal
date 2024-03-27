import {Box, Button, Stack, TextField} from "@mui/material";

interface UsernameUpdateFormProps {
  username: string,
  handleUsernameUpdate: (event: any) => Promise<void>
}

export default function UsernameUpdateForm(props: UsernameUpdateFormProps) {
  return (<Box sx={{padding: 2}} component={"form"} onSubmit={props.handleUsernameUpdate}>
    <Stack spacing={2}>
      <TextField name={"username"}
                 type={"text"}
                 label={"Username"}
                 required
                 defaultValue={props.username}
                 inputProps={{minLength: 1, maxLength: 50}}/>
      <TextField name={"password"}
                 type={"password"}
                 label={"Password"}
                 required
                 inputProps={{minLength: 8, maxLength: 50}}/>
      <Stack direction={"row"} spacing={2}>
        <Button type={"submit"} sx={{maxWidth: "fit-content"}} variant={"outlined"}>
          Change Username
        </Button>
      </Stack>
    </Stack>
  </Box>)
}
