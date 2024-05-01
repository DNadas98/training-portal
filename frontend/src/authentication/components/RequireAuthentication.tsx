import {Outlet, useNavigate} from "react-router-dom";

import {GlobalRole} from "../dto/userInfo/GlobalRole.ts";
import useLogout from "../hooks/useLogout.ts";
import {useEffect, useState} from "react";
import useRefresh from "../hooks/useRefresh.ts";
import LoadingSpinner from "../../common/utils/components/LoadingSpinner.tsx";
import {useAuthentication} from "../hooks/useAuthentication.ts";
import {useNotification} from "../../common/notification/context/NotificationProvider.tsx";
import useLocalized from "../../common/localization/hooks/useLocalized.tsx";

interface RequireAuthProps {
  allowedRoles: Array<GlobalRole>;
}

export default function RequireAuthentication({allowedRoles}: RequireAuthProps) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const authentication = useAuthentication();
  const notification = useNotification();
  const localized = useLocalized();
  const refresh = useRefresh();
  const logout = useLogout();
  const navigate = useNavigate();

  async function handleUnauthorized() {
    const message = localized("common.error.auth.unauthorized");
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: message
    });
    await logout();
  }

  async function handleAccessDenied() {
    const message = localized("common.error.auth.access_denied");
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: message
    });
    navigate(-1);
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
          await handleUnauthorized();
          return;
        }
      }
      if (roles?.some(role => allowedRoles.includes(role))) {
        setAllowed(true);
      } else {
        await handleAccessDenied();
        return;
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
