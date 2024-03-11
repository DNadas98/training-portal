import {Card, CardContent, CardHeader, Grid, Stack, Typography} from "@mui/material";
import {AccountBoxRounded} from "@mui/icons-material";
import {GlobalRole} from "../../../../authentication/dto/userInfo/GlobalRole.ts";

interface ProfileMainCardProps {
  username: string;
  email: string;
  roles: GlobalRole[]
}

export default function ProfileMainCard(props: ProfileMainCardProps) {
  return (
    <Card>
      <CardHeader avatar={<AccountBoxRounded color={"secondary"}/>}
                  title={props.username} titleTypographyProps={{"variant": "h6"}}
                  subtitle={props.email}>
      </CardHeader>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant={"body1"}>
            E-mail address:
          </Typography>
          <Typography variant={"body2"}>
            {props.email}
          </Typography>
          <Grid container>
            {props.roles?.length > 1
              ? props.roles.map((role) => (
                <Grid item key={role}>
                  <Typography variant={"body2"}>
                    {role}
                  </Typography>
                </Grid>
              ))
              : <></>}
          </Grid>
        </Stack>
      </CardContent>
    </Card>
  )
}
