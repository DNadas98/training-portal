import {IconButton, Stack, Typography} from "@mui/material";
import {
  UserAccountResponseDto
} from "../../../../authentication/dto/userAccount/UserAccountResponseDto.ts";
import DeleteIcon from "../../../../common/utils/components/DeleteIcon.tsx";

interface ProfileAccountDeleteProps {
  account: UserAccountResponseDto;
  onAccountDelete: (id: number) => void;
  accountDeleteLoading: boolean;
}

export default function ProfileAccountDelete(props: ProfileAccountDeleteProps) {
  return (
    <Stack direction={"row"}
           spacing={"2"}
           justifyContent={"space-between"}
           alignItems={"center"}>
      <Typography>
        {props.account.accountType}
      </Typography>
      <IconButton disabled={props.accountDeleteLoading} onClick={() => {
        props.onAccountDelete(props.account.id);
      }}>
        <DeleteIcon/>
      </IconButton>
    </Stack>
  )
}
