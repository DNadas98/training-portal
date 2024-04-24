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
import {UserFullNameUpdateDto} from "../../dto/UserFullNameUpdateDto.ts";
import {UserEmailUpdateDto} from "../../dto/UserEmailUpdateDto.ts";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";
import {passwordRegex} from "../../../common/utils/regex.ts";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";

export default function Profile() {
  const [applicationUserDeleteLoading, setApplicationUserDeleteLoading] = useState<boolean>(false);
  const authJsonFetch = useAuthJsonFetch();
  const authentication = useAuthentication();
  const dialog = useDialog();
  const notification = useNotification();
  const username = authentication.getUsername();
  const fullName = authentication.getFullName();
  const roles = authentication.getRoles();
  const email = authentication.getEmail();
  const logout = useLogout();
  const refresh = useRefresh();
  const navigate = useNavigate();
  const [userDetailsUpdateLoading, setUserDetailsUpdateLoading] = useState<boolean>(false);
  const localized = useLocalized();

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
      content: "Do you really wish to archive your account and erase all your personal data permanently?",
      onConfirm: deleteApplicationUser
    });
  }

  const [fullNameFormOpen, setFullNameFormOpen] = useState<boolean>(false);
  const [emailFormOpen, setEmailFormOpen] = useState<boolean>(false);
  const [passwordFormOpen, setPasswordFormOpen] = useState<boolean>(false);

  async function handleFullNameUpdate(event: any) {
    const defaultError =
      "Failed to update full name.\n Please try again later, if the issue still persists, please contact our administrators";
    try {
      event.preventDefault();
      setUserDetailsUpdateLoading(true);
      const formData = new FormData(event.target);
      const dto: UserFullNameUpdateDto = {
        fullName: formData.get("fullName") as string,
        password: formData.get("password") as string,
      }
      if (!passwordRegex.test(dto.password)) {
        return notifyOnError(localized("inputs.password_invalid"));
      }
      const response = await authJsonFetch({
        path: `user/fullName`, method: "PATCH", body: dto
      });
      if (response?.status !== 200 || !response.message) {
        return notifyOnError(response?.error ?? defaultError);
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center", message: response.message
      });
      setFullNameFormOpen(false);
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
      if (!passwordRegex.test(dto.password) || !passwordRegex.test(dto.newPassword)) {
        return notifyOnError(localized("inputs.password_invalid"));
      }
      const confirmNewPassword = formData.get("confirmNewPassword") as any;
      if (dto.newPassword !== confirmNewPassword) {
        return notifyOnError(localized("inputs.confirm_password_invalid"));
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
      if (!passwordRegex.test(dto.password)) {
        return notifyOnError(localized("inputs.password_invalid"));
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
      <ProfileDashboard fullName={fullName ?? ""}
                        username={username}
                        email={email}
                        roles={roles}
                        onApplicationUserDelete={openDeleteApplicationUserDialog}
                        applicationUserDeleteLoading={applicationUserDeleteLoading}
                        handleFullNameUpdate={handleFullNameUpdate}
                        handleUserEmailUpdate={handleUserEmailUpdate}
                        handleUserPasswordUpdate={handleUserPasswordUpdate}
                        usernameFormOpen={fullNameFormOpen}
                        setUsernameFormOpen={setFullNameFormOpen}
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
