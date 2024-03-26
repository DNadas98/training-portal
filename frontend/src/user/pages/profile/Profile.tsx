import {useAuthentication} from "../../../authentication/hooks/useAuthentication.ts";
import ProfileDashboard from "./components/ProfileDashboard.tsx";
import {useState} from "react";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import useLogout from "../../../authentication/hooks/useLogout.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useNavigate} from "react-router-dom";
import {UserDetailsUpdateDto} from "../../dto/UserDetailsUpdateDto.ts";
import useRefresh from "../../../authentication/hooks/useRefresh.ts";

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
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center", message: response.message
      })
      return await logout(true);
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

  const isValidPassword = (password: string | undefined) => {
    return password && password?.length >= 8 && password?.length <= 50;
  }

  async function handleUserDetailsUpdate(event: any) {
    const defaultError =
      "Failed to update user details.\n Please try again later, if the issue still persists, please contact our administrators";
    try {
      event.preventDefault();
      setUserDetailsUpdateLoading(true);
      const formData = new FormData(event.target);
      const dto: UserDetailsUpdateDto = {
        username: formData.get("username") as string,
        oldPassword: formData.get("oldPassword") as string,
      }

      const newPassword = formData.get("newPassword") as any;
      const confirmNewPassword = formData.get("confirmNewPassword") as any;
      if (newPassword?.length > 1) {
        if (!isValidPassword(newPassword) || !isValidPassword(confirmNewPassword)) {
          return notifyOnError("Password must be 8-50 characters long");
        }
        if (newPassword !== confirmNewPassword) {
          return notifyOnError("New Password and Confirm New Password fields do not match");
        }
        dto.newPassword = newPassword as string;
      }

      const response = await authJsonFetch({
        path: `user/details`, method: "PATCH", body: dto
      });
      if (response?.status !== 200 || !response.message) {
        return notifyOnError(response?.error ?? defaultError);
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center", message: response.message
      });
      await refresh();
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
                        handleUserDetailsUpdate={handleUserDetailsUpdate}
                        onRequestsClick={() => {
                          navigate("/user/requests")
                        }}
      />
    ) : <></>
}
