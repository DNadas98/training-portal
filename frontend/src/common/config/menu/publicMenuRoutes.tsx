import {IMenuRoutes} from "../../routing/IMenuRoutes.ts";
import Home from "../../../public/pages/home/Home.tsx";
import Login from "../../../authentication/pages/login/Login.tsx";
import Register from "../../../authentication/pages/register/Register.tsx";

export const publicMenuRoutes: IMenuRoutes = {
  routePrefix: "/",
  elements: [
    {path: "", name: "Home", element: <Home/>},
    {path: "login", name: "Sign in", element: <Login/>},
    {path: "register", name: "Sign up", element: <Register/>}
  ]
}
