import {Box, Button, Stack, TextField} from "@mui/material";

interface FullNameUpdateFormProps {
  fullName: string,
  handleFullNameUpdate: (event: any) => Promise<void>
}

export default function FullNameUpdateForm(props: FullNameUpdateFormProps) {
  return (<Box sx={{padding: 2}} component={"form"} onSubmit={props.handleFullNameUpdate}>
    <Stack spacing={2}>
      <TextField name={"fullName"}
                 type={"text"}
                 label={"Full Name"}
                 required
                 defaultValue={props.fullName}
                 inputProps={{minLength: 1, maxLength: 50}}/>
      <TextField name={"password"}
                 type={"password"}
                 label={"Password"}
                 required
                 inputProps={{minLength: 8, maxLength: 50}}/>
      <Stack direction={"row"} spacing={2}>
        <Button type={"submit"} sx={{maxWidth: "fit-content"}} variant={"outlined"}>
          Change Full Name
        </Button>
      </Stack>
    </Stack>
  </Box>)
}
