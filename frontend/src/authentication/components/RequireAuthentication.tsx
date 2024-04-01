import {Outlet} from "react-router-dom";

import {GlobalRole} from "../dto/userInfo/GlobalRole.ts";
import useLogout from "../hooks/useLogout.ts";
import {useEffect, useState} from "react";
import useRefresh from "../hooks/useRefresh.ts";
import LoadingSpinner from "../../common/utils/components/LoadingSpinner.tsx";
import {useAuthentication} from "../hooks/useAuthentication.ts";
import {useNotification} from "../../common/notification/context/NotificationProvider.tsx";

interface RequireAuthProps {
  allowedRoles: Array<GlobalRole>;
}

export default function RequireAuthentication({allowedRoles}: RequireAuthProps) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const authentication = useAuthentication();
  const notification = useNotification();
  const refresh = useRefresh();
  const logout = useLogout();

  async function handleUnauthorized() {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: "Unauthorized"
    });
    await logout();
  }

  async function handleAccessDenied() {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: "Access Denied"
    });
    await logout();
  }

  useEffect(() => {
    async function verifyAllowed() {
      let roles = authentication.getRoles();
      if (!authentication.getAccessToken()?.length) {
        const refreshResponseDto = await refresh();
        const refreshedRoles = refreshResponseDto?.newAuthentication?.userInfo?.roles;
        if (refreshedRoles?.length) {
          roles = refreshedRoles;
        } else {
          return await handleUnauthorized();
        }
      }
      if (roles?.some(role => allowedRoles.includes(role))) {
        setAllowed(true);
      } else {
        return await handleAccessDenied();
      }
    }

    verifyAllowed().finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (<LoadingSpinner/>);
  } else if (allowed) {
    return (<Outlet/>);
  }
  return null;
}
