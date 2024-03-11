import {useAuthentication} from "../../../authentication/hooks/useAuthentication.ts";
import ProfileDashboard from "./components/ProfileDashboard.tsx";
import {useState} from "react";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {ApiResponseDto} from "../../../common/api/dto/ApiResponseDto.ts";
import useLogout from "../../../authentication/hooks/useLogout.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useNavigate} from "react-router-dom";

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
  const navigate = useNavigate();

  async function deleteApplicationUser(): Promise<void> {
    const defaultError =
      "Failed to remove user data.\n Please try again later, if the issue still persists, please contact our administrators";
    try {
      setApplicationUserDeleteLoading(true);
      const response = await authJsonFetch({
        path: `user`, method: "DELETE"
      });
      if (response?.status !== 200 || !response.message) {
        return notifyOnError(defaultError, response ?? undefined);
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

  function notifyOnError(defaultError: string, response: ApiResponseDto | undefined = undefined) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: `${response?.error ?? defaultError}`
    });
    return;
  }

  return applicationUserDeleteLoading
    ? <LoadingSpinner/>
    : username && email && roles ? (
      <ProfileDashboard username={username}
                        email={email}
                        roles={roles}
                        onApplicationUserDelete={openDeleteApplicationUserDialog}
                        applicationUserDeleteLoading={applicationUserDeleteLoading}
                        onRequestsClick={() => {
                          navigate("/user/requests")
                        }}
      />
    ) : <></>
}
