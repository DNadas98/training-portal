import {Button, Card, CardContent, CardHeader, Dialog, DialogContent, DialogTitle, Grid, Stack,} from "@mui/material";
import {GlobalRole} from "../../../../authentication/dto/userInfo/GlobalRole.ts";
import ProfileMainCard from "./ProfileMainCard.tsx";
import FullNameUpdateForm from "./FullNameUpdateForm.tsx";
import PasswordUpdateForm from "./PasswordUpdateForm.tsx";
import EmailUpdateForm from "./EmailUpdateForm.tsx";

interface ProfileDashboardProps {
  fullName: string,
  username: string,
  email: string,
  roles: GlobalRole[],
  onApplicationUserDelete: () => unknown,
  applicationUserDeleteLoading: boolean,
  onRequestsClick: () => void,
  handleFullNameUpdate: (event: any) => Promise<void>,
  handleUserPasswordUpdate: (event: any) => Promise<void>,
  handleUserEmailUpdate: (event: any) => Promise<void>,
  usernameFormOpen: boolean,
  setUsernameFormOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void,
  passwordFormOpen: boolean,
  setPasswordFormOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void,
  emailFormOpen: boolean,
  setEmailFormOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export default function ProfileDashboard(props: ProfileDashboardProps) {
  return (
    <Grid container justifyContent={"center"}>
      <Grid item xs={10} sm={5} mb={4} lg={3}>
        <Stack spacing={2}>
          <ProfileMainCard fullName={props.fullName}
                           username={props.username}
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
            <CardHeader title={"Manage User Details"} titleTypographyProps={{variant: "h6"}}/>
            <CardContent>
              <Stack spacing={2}>
                <Button type={"button"} sx={{maxWidth: "fit-content"}}
                        onClick={() => props.setUsernameFormOpen(true)}>
                  Change Full Name
                </Button>
                <Button type={"button"} sx={{maxWidth: "fit-content"}}
                        onClick={() => props.setEmailFormOpen(true)}>
                  Change E-mail Address
                </Button>
                <Button type={"button"} sx={{maxWidth: "fit-content"}}
                        onClick={() => props.setPasswordFormOpen(true)}>
                  Change Password
                </Button>
                <Button type={"button"} sx={{maxWidth: "fit-content"}}
                        disabled={props.applicationUserDeleteLoading}
                        onClick={props.onApplicationUserDelete}
                        variant={"contained"} color={"error"}>
                  Remove All User Data
                </Button>
              </Stack>
            </CardContent>
          </Card>
          <Dialog open={props.usernameFormOpen} onClose={() => props.setUsernameFormOpen(false)}>
            <DialogTitle>Change Full Name</DialogTitle>
            <DialogContent>
              <FullNameUpdateForm handleFullNameUpdate={props.handleFullNameUpdate} fullName={props.fullName}/>
            </DialogContent>
          </Dialog>
          <Dialog open={props.emailFormOpen} onClose={() => props.setEmailFormOpen(false)}>
            <DialogTitle>Change E-mail Address</DialogTitle>
            <EmailUpdateForm handleUserEmailUpdate={props.handleUserEmailUpdate}/>
          </Dialog>
          <Dialog open={props.passwordFormOpen} onClose={() => props.setPasswordFormOpen(false)}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <PasswordUpdateForm handleUserPasswordUpdate={props.handleUserPasswordUpdate}/>
            </DialogContent>
          </Dialog>
        </Stack></Grid></Grid>
  )
}
