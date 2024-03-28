import {useAuthentication} from "../../../authentication/hooks/useAuthentication.ts";
import ProfileDashboard from "./components/ProfileDashboard.tsx";
import {useState} from "react";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import useLogout from "../../../authentication/hooks/useLogout.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useNavigate} from "react-router-dom";
import {UserPasswordUpdateDto} from "../../dto/UserPasswordUpdateDto.ts";
import useRefresh from "../../../authentication/hooks/useRefresh.ts";
import {UserUsernameUpdateDto} from "../../dto/UserUsernameUpdateDto.ts";
import {UserEmailUpdateDto} from "../../dto/UserEmailUpdateDto.ts";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";

export default function Profile() {
  const [applicationUserDeleteLoading, setApplicationUserDeleteLoading] = useState<boolean>(false);
  const authJsonFetch = useAuthJsonFetch();
  const authentication = useAuthentication();
  const dialog = useDialog();
  const notification = useNotification();
  const username = authentication.getUsername();
  const roles = authentication.getRoles();
  const email = authentication.getEmail();
  const logout = useLogout();
  const refresh = useRefresh();
  const navigate = useNavigate();
  const [userDetailsUpdateLoading, setUserDetailsUpdateLoading] = useState<boolean>(false);

  async function deleteApplicationUser(): Promise<void> {
    const defaultError =
      "Failed to remove user data.\n Please try again later, if the issue still persists, please contact our administrators";
    try {
      setApplicationUserDeleteLoading(true);
      const response = await authJsonFetch({
        path: `user`, method: "DELETE"
      });
      if (response?.status !== 200 || !response.message) {
        return notifyOnError(response?.error ?? defaultError);
      }
      await logout(true);
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center", message: response.message
      });
    } catch (e) {
      notifyOnError(defaultError);
    } finally {
      setApplicationUserDeleteLoading(false);
    }
  }

  function openDeleteApplicationUserDialog() {
    return dialog.openDialog({
      text: "Do you really wish to erase all your user data permanently?",
      onConfirm: deleteApplicationUser
    })
  }

  const [usernameFormOpen, setUsernameFormOpen] = useState<boolean>(false);
  const [emailFormOpen, setEmailFormOpen] = useState<boolean>(false);
  const [passwordFormOpen, setPasswordFormOpen] = useState<boolean>(false);

  async function handleUsernameUpdate(event: any) {
    const defaultError =
      "Failed to update username.\n Please try again later, if the issue still persists, please contact our administrators";
    try {
      event.preventDefault();
      setUserDetailsUpdateLoading(true);
      const formData = new FormData(event.target);
      const dto: UserUsernameUpdateDto = {
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      }
      const response = await authJsonFetch({
        path: `user/username`, method: "PATCH", body: dto
      });
      if (response?.status !== 200 || !response.message) {
        return notifyOnError(response?.error ?? defaultError);
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center", message: response.message
      });
      setUsernameFormOpen(false);
      await refresh();
    } catch (e) {
      return notifyOnError(defaultError);
    } finally {
      setUserDetailsUpdateLoading(false);
    }
  }

  async function handleUserPasswordUpdate(event: any) {
    const defaultError =
      "Failed to update password.\n Please try again later, if the issue still persists, please contact our administrators";
    try {
      event.preventDefault();
      setUserDetailsUpdateLoading(true);
      const formData = new FormData(event.target);
      const dto: UserPasswordUpdateDto = {
        password: formData.get("password") as string,
        newPassword: formData.get("newPassword") as string,
      }
      const confirmNewPassword = formData.get("confirmNewPassword") as any;
      if (dto.newPassword !== confirmNewPassword) {
        return notifyOnError("New Password and Confirm New Password fields do not match");
      }
      const response = await authJsonFetch({
        path: `user/password`, method: "PATCH", body: dto
      });
      if (response?.status !== 200 || !response.message) {
        return notifyOnError(response?.error ?? defaultError);
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center", message: response.message
      });
      setPasswordFormOpen(false);
      await refresh();
    } catch (e) {
      return notifyOnError(defaultError);
    } finally {
      setUserDetailsUpdateLoading(false);
    }
  }

  async function handleUserEmailUpdate(event: any) {
    const defaultError =
      "Failed to update e-mail address.\n Please try again later, if the issue still persists, please contact our administrators";
    try {
      event.preventDefault();
      setUserDetailsUpdateLoading(true);
      const formData = new FormData(event.target);
      const dto: UserEmailUpdateDto = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      }
      if (dto.email === email) {
        notifyOnError("The provided e-mail address matches your current e-mail address");
        setEmailFormOpen(false);
      }
      const response = await authJsonFetch({
        path: `user/email`, method: "PATCH", body: dto
      });
      if (response?.status !== 200 || !response.message) {
        return notifyOnError(response?.error ?? defaultError);
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center", message: response.message
      });
      setEmailFormOpen(false);
      await logout(true);
    } catch (e) {
      return notifyOnError(defaultError);
    } finally {
      setUserDetailsUpdateLoading(false);
    }
  }

  function notifyOnError(message: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: message
    });
    return;
  }

  return userDetailsUpdateLoading || applicationUserDeleteLoading
    ? <LoadingSpinner/>
    : username && email && roles ? (
      <ProfileDashboard username={username}
                        email={email}
                        roles={roles}
                        onApplicationUserDelete={openDeleteApplicationUserDialog}
                        applicationUserDeleteLoading={applicationUserDeleteLoading}
                        handleUsernameUpdate={handleUsernameUpdate}
                        handleUserEmailUpdate={handleUserEmailUpdate}
                        handleUserPasswordUpdate={handleUserPasswordUpdate}
                        usernameFormOpen={usernameFormOpen}
                        setUsernameFormOpen={setUsernameFormOpen}
                        passwordFormOpen={passwordFormOpen}
                        setPasswordFormOpen={setPasswordFormOpen}
                        emailFormOpen={emailFormOpen}
                        setEmailFormOpen={setEmailFormOpen}
                        onRequestsClick={() => {
                          navigate("/user/requests")
                        }}
      />
    ) : <></>
}
