import {Button, Card, CardContent, CardHeader, Dialog, DialogContent, DialogTitle, Grid, Stack,} from "@mui/material";
import {GlobalRole} from "../../../../authentication/dto/userInfo/GlobalRole.ts";
import ProfileMainCard from "./ProfileMainCard.tsx";
import FullNameUpdateForm from "./FullNameUpdateForm.tsx";
import PasswordUpdateForm from "./PasswordUpdateForm.tsx";
import EmailUpdateForm from "./EmailUpdateForm.tsx";
import useLocalized from "../../../../common/localization/hooks/useLocalized.tsx";

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
  fullNameFormOpen: boolean,
  setFullNameFormOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void,
  passwordFormOpen: boolean,
  setPasswordFormOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void,
  emailFormOpen: boolean,
  setEmailFormOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void
}

export default function ProfileDashboard(props: ProfileDashboardProps) {
  const localized = useLocalized();
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
            <CardHeader title={localized("pages.user.profile.groups_and_projects")}
                        titleTypographyProps={{variant: "h6"}}/>
            <CardContent> <Button sx={{maxWidth: "fit-content"}}
                                  onClick={props.onRequestsClick}
                                  variant={"text"}>
              {localized("pages.user.profile.manage_join_requests")}
            </Button> </CardContent>
          </Card>
          <Card>
            <CardHeader title={localized("pages.user.profile.user_details")} titleTypographyProps={{variant: "h6"}}/>
            <CardContent>
              <Stack spacing={2}>
                <Button type={"button"} sx={{maxWidth: "fit-content"}}
                        onClick={() => props.setFullNameFormOpen(true)}>
                  {localized("pages.user.profile.change_full_name")}
                </Button>
                <Button type={"button"} sx={{maxWidth: "fit-content"}}
                        onClick={() => props.setEmailFormOpen(true)}>
                  {localized("pages.user.profile.change_email")}
                </Button>
                <Button type={"button"} sx={{maxWidth: "fit-content"}}
                        onClick={() => props.setPasswordFormOpen(true)}>
                  {localized("pages.user.profile.change_password")}
                </Button>
                <Button type={"button"} sx={{maxWidth: "fit-content"}}
                        disabled={props.applicationUserDeleteLoading}
                        onClick={props.onApplicationUserDelete}
                        variant={"contained"} color={"error"}>
                  {localized("pages.user.profile.remove_user")}
                </Button>
              </Stack>
            </CardContent>
          </Card>
          <Dialog open={props.fullNameFormOpen} onClose={() => props.setFullNameFormOpen(false)}>
            <DialogTitle>{localized("pages.user.profile.change_full_name")}</DialogTitle>
            <DialogContent>
              <FullNameUpdateForm handleFullNameUpdate={props.handleFullNameUpdate} fullName={props.fullName}/>
            </DialogContent>
          </Dialog>
          <Dialog open={props.emailFormOpen} onClose={() => props.setEmailFormOpen(false)}>
            <DialogTitle>{localized("pages.user.profile.change_email")}</DialogTitle>
            <EmailUpdateForm handleUserEmailUpdate={props.handleUserEmailUpdate}/>
          </Dialog>
          <Dialog open={props.passwordFormOpen} onClose={() => props.setPasswordFormOpen(false)}>
            <DialogTitle>{localized("pages.user.profile.change_password")}</DialogTitle>
            <DialogContent>
              <PasswordUpdateForm handleUserPasswordUpdate={props.handleUserPasswordUpdate}/>
            </DialogContent>
          </Dialog>
        </Stack></Grid></Grid>
  )
}
