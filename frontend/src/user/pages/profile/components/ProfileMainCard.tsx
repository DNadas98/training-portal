import {Card, CardActions, CardContent, CardHeader, Stack, Typography} from "@mui/material";
import {AccountBoxRounded} from "@mui/icons-material";
import {GlobalRole} from "../../../../authentication/dto/userInfo/GlobalRole.ts";

interface ProfileMainCardProps {
  username: string,
  email: string,
  roles: GlobalRole[],
  onRequestsClick: () => void
}

export default function ProfileMainCard(props: ProfileMainCardProps) {
  return (
    <Card>
      <CardHeader avatar={<AccountBoxRounded color={"secondary"} sx={{height: 40, width: 40}}/>}
                  title={props.username} titleTypographyProps={{"variant": "h5"}}
                  subtitle={props.email}>
      </CardHeader>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant={"body1"}>
            E-mail address: {props.email}
          </Typography>
          {props.roles?.length > 1 ?
            <Typography variant={"body1"}>
              Roles: {props.roles.join(", ")}
            </Typography> : <></>}
        </Stack>
      </CardContent>

      <CardActions>
      </CardActions>
    </Card>
  )
}
