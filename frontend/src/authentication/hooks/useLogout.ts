import * as apiService from "../../common/api/service/apiService.ts";
import {useNavigate} from "react-router-dom";
import {useAuthentication} from "./useAuthentication.ts";

export default function useLogout() {
    const authentication = useAuthentication();
    const navigate = useNavigate();
    const logout = async (willfulLogout: boolean = false) => {
        try {
            await apiService.publicJsonFetch({
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
