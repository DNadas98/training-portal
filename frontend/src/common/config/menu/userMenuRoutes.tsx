import {IMenuRoutes} from "../../routing/IMenuRoutes.ts";
import Home from "../../../public/pages/home/Home.tsx";
import Companies from "../../../companies/pages/companies/Companies.tsx";
import UserJoinRequests from "../../../user/pages/requests/UserJoinRequests.tsx";

export const userMenuRoutes: IMenuRoutes = {
  routePrefix: "",
  elements: [
    {path: "", name: "Home", element: <Home/>},
    {path: "companies", name: "Companies", element: <Companies/>},
    {path: "user/requests", name: "Join requests", element: <UserJoinRequests/>}
  ]
}
