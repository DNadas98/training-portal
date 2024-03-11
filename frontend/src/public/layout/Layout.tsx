import {Outlet} from "react-router-dom";
import {Box} from "@mui/material";
import PublicHeader from "./PublicHeader.tsx";
import PublicFooter from "./PublicFooter.tsx";
import {useAuthentication} from "../../authentication/hooks/useAuthentication.ts";
import UserHeader from "../../user/layout/UserHeader.tsx";
import UserFooter from "../../user/layout/UserFooter.tsx";

function Layout() {
  const isAuthenticated = useAuthentication().getUsername()?.length;
  return (
    <Box sx={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
      {isAuthenticated ? <UserHeader/> : <PublicHeader/>}
      <Box sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Outlet/>
      </Box>
      {isAuthenticated ? <UserFooter/> : <PublicFooter/>}
    </Box>
  );
}

export default Layout;
