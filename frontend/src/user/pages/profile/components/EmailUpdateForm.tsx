import {Box, Button, Stack} from "@mui/material";
import EmailInput from "../../../../authentication/components/inputs/EmailInput.tsx";
import PasswordInput from "../../../../authentication/components/inputs/PasswordInput.tsx";
import useLocalized from "../../../../common/localization/hooks/useLocalized.tsx";

interface EmailUpdateFormProps {
  handleUserEmailUpdate: (event: any) => Promise<void>;
}

export default function EmailUpdateForm(props: EmailUpdateFormProps) {
  const localized = useLocalized();
  return (<Box sx={{padding: 2}} component={"form"} onSubmit={props.handleUserEmailUpdate}>
    <Stack spacing={2}>
      <EmailInput/>
      <PasswordInput/>
      <Stack direction={"row"} spacing={2}>
        <Button type={"submit"} sx={{maxWidth: "fit-content"}} variant={"outlined"}>
          {localized("pages.user.profile.change_email")}
        </Button>
      </Stack>
    </Stack>
  </Box>)
}
