import {useNavigate} from "react-router-dom";
import {useAuthentication} from "./useAuthentication.ts";
import usePublicJsonFetch from "../../common/api/hooks/usePublicJsonFetch.tsx";

export default function useLogout() {
    const authentication = useAuthentication();
    const navigate = useNavigate();
  const publicJsonFetch = usePublicJsonFetch();
    const logout = async (willfulLogout: boolean = false) => {
        try {
          await publicJsonFetch({
                path: "auth/logout", method: "GET"
            });
            authentication.logout();
            navigate(willfulLogout ? "/" : "/login");
        } catch (e) {
            console.error("Failed to log out");
            throw e;
        }
    };
    return logout;
}
