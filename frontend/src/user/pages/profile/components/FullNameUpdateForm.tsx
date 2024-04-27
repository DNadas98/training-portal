import {Box, Button, Stack} from "@mui/material";
import FullNameInput from "../../../../authentication/components/inputs/FullNameInput.tsx";
import PasswordInput from "../../../../authentication/components/inputs/PasswordInput.tsx";
import useLocalized from "../../../../common/localization/hooks/useLocalized.tsx";

interface FullNameUpdateFormProps {
  fullName: string,
  handleFullNameUpdate: (event: any) => Promise<void>
}

export default function FullNameUpdateForm(props: FullNameUpdateFormProps) {
  const localized = useLocalized();
  return (<Box sx={{padding: 2}} component={"form"} onSubmit={props.handleFullNameUpdate}>
    <Stack spacing={2}>
      <FullNameInput/>
      <PasswordInput/>
      <Stack direction={"row"} spacing={2}>
        <Button type={"submit"} sx={{maxWidth: "fit-content"}} variant={"outlined"}>
          {localized("pages.user.profile.change_full_name")}
        </Button>
      </Stack>
    </Stack>
  </Box>)
}
