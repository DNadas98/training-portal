import {IMenuRoutes} from "../../routing/IMenuRoutes.ts";
import Profile from "../../../user/pages/profile/Profile.tsx";
import Logout from "../../../authentication/pages/Logout.tsx";
import UserJoinRequests from "../../../user/pages/requests/UserJoinRequests.tsx";

export const userMenuProfileRoutes: IMenuRoutes = {
  routePrefix: "/user/",
  elements: [
    {path: "", name: "Profile", element: <Profile/>},
    {path: "requests", name: "Join requests", element: <UserJoinRequests/>},
    {path: "logout", name: "Sign out", element: <Logout/>}
  ]
}
