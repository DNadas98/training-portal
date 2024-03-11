import {IMenuRoutes} from "../../routing/IMenuRoutes.ts";
import Home from "../../../public/pages/home/Home.tsx";
import Groups from "../../../groups/pages/groups/Groups.tsx";
import UserJoinRequests from "../../../user/pages/requests/UserJoinRequests.tsx";

export const userMenuRoutes: IMenuRoutes = {
  routePrefix: "",
  elements: [
    {path: "", name: "Home", element: <Home/>},
    {path: "groups", name: "Groups", element: <Groups/>},
    {path: "user/requests", name: "Join requests", element: <UserJoinRequests/>}
  ]
}
