import {Box, Button, Card, CardContent, CardHeader, Grid, Stack, TextField} from "@mui/material";
import {GlobalRole} from "../../../../authentication/dto/userInfo/GlobalRole.ts";
import ProfileMainCard from "./ProfileMainCard.tsx";

interface ProfileDashboardProps {
  username: string,
  email: string,
  roles: GlobalRole[],
  onApplicationUserDelete: () => unknown,
  applicationUserDeleteLoading: boolean,
  onRequestsClick: () => void,
  handleUserDetailsUpdate: (event: any) => Promise<void>
}

export default function ProfileDashboard(props: ProfileDashboardProps) {
  return (
    <Grid container justifyContent={"center"}>
      <Grid item xs={10} sm={5} mb={4} lg={3}>
        <Stack spacing={2}>
          <ProfileMainCard username={props.username}
                           email={props.email}
                           roles={props.roles}
                           onRequestsClick={props.onRequestsClick}/>
          <Card>
            <CardHeader title={"Groups and Projects"} titleTypographyProps={{variant: "h6"}}/>
            <CardContent> <Button sx={{maxWidth: "fit-content"}}
                                  onClick={props.onRequestsClick}
                                  variant={"text"}>
              Manage Join Requests
            </Button> </CardContent>
          </Card>
          <Card>
            <CardHeader title={"Update User Details"} titleTypographyProps={{variant: "h6"}}/>
            <CardContent>
              <Box component={"form"} onSubmit={props.handleUserDetailsUpdate}>
                <Stack spacing={2}>
                  <TextField name={"username"}
                             type={"text"}
                             label={"Username"}
                             required
                             defaultValue={props.username}
                             inputProps={{minLength: 1, maxLength: 50}}/>
                  <TextField name={"oldPassword"}
                             type={"password"}
                             label={"Current Password"}
                             required
                             inputProps={{minLength: 8, maxLength: 50}}/>
                  <TextField name={"newPassword"}
                             type={"password"}
                             label={"(Optional) New Password"}/>
                  <TextField name={"confirmNewPassword"}
                             type={"password"}
                             label={"(Optional) Confirm New Password"}/>
                  <Stack direction={"row"} spacing={2}>
                    <Button type={"submit"} sx={{maxWidth: "fit-content"}} variant={"outlined"}>
                      Update Details
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </CardContent>
          </Card>
          <Card><CardContent>
            <Button type={"button"} sx={{maxWidth: "fit-content"}}
                    disabled={props.applicationUserDeleteLoading}
                    onClick={props.onApplicationUserDelete}
                    variant={"contained"} color={"error"}>
              Remove All User Data
            </Button>
          </CardContent></Card>
        </Stack></Grid></Grid>
  )
}
