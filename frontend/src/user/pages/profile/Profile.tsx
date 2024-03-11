import {useAuthentication} from "../../../authentication/hooks/useAuthentication.ts";
import ProfileDashboard from "./components/ProfileDashboard.tsx";
import {useEffect, useState} from "react";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import {ApiResponseDto} from "../../../common/api/dto/ApiResponseDto.ts";
import useLogout from "../../../authentication/hooks/useLogout.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {
  UserAccountResponseDto
} from "../../../authentication/dto/userAccount/UserAccountResponseDto.ts";
import {useNavigate} from "react-router-dom";

export default function Profile() {
  const [loading, setLoading] = useState<boolean>(true);
  const [accountDeleteLoading, setAccountDeleteLoading] = useState<boolean>(false);
  const [applicationUserDeleteLoading, setApplicationUserDeleteLoading] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<UserAccountResponseDto[]>([]);
  const authJsonFetch = useAuthJsonFetch();
  const authentication = useAuthentication();
  const dialog = useDialog();
  const notification = useNotification();
  const username = authentication.getUsername();
  const roles = authentication.getRoles();
  const email = authentication.getEmail();
  const accountType = authentication.getAccountType();
  const logout = useLogout();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadAccounts() {
      try {
        const apiResponse = await authJsonFetch({
          path: "user/accounts", method: "GET"
        });
        if (!apiResponse?.data) {
          setAccounts([]);
          return;
        }
        setAccounts(apiResponse.data as UserAccountResponseDto[]);
      } catch (e) {
        setAccounts([]);
      }
    }

    loadAccounts().finally(() => {
      setLoading(false);
    })
  }, []);

  async function deleteAccount(id: number): Promise<void> {
    const defaultError = "Failed to delete account";
    try {
      setAccountDeleteLoading(true);
      const response = await authJsonFetch({
        path: `user/accounts/${id}`, method: "DELETE"
      });
      if (response?.status!==200) {
        return notifyOnError(defaultError, response ?? undefined);
      }

      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center", message: response.message
      })
      if (accountType === accounts.find(el => el.id === id)?.accountType) {
        return await logout(true);
      }
      setAccounts((prev) => {
        return prev.filter(el => el.id !== id);
      });
    } catch (e) {
      notifyOnError(defaultError);
    } finally {
      setAccountDeleteLoading(false);
    }
  }

  function openDeleteAccountDialog(id: number) {
    return dialog.openDialog({
      text: "Are you certain you want to delete this account?\n"
        + "If the currently used account is deleted, You will be redirected to the Sign In page.",
      onConfirm: () => deleteAccount(id)
    });
  }

  async function deleteApplicationUser(): Promise<void> {
    const defaultError =
      "Failed to remove user data.\n Please try again later, if the issue still persists, please contact our administrators";
    try {
      setApplicationUserDeleteLoading(true);
      const response = await authJsonFetch({
        path: `user`, method: "DELETE"
      });
      if (response?.status!==200) {
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
    })
    return;
  }

  return loading||accountDeleteLoading||applicationUserDeleteLoading
    ? <LoadingSpinner/>
    : username && email && roles ? (
      <ProfileDashboard username={username}
                        email={email}
                        roles={roles}
                        accounts={accounts}
                        onAccountDelete={openDeleteAccountDialog}
                        accountDeleteLoading={accountDeleteLoading}
                        onApplicationUserDelete={openDeleteApplicationUserDialog}
                        applicationUserDeleteLoading={applicationUserDeleteLoading}
                        onRequestsClick={() => {
                          navigate("/user/requests")
                        }}
      />
    ) : <></>
}
