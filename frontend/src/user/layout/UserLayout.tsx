import {Outlet} from "react-router-dom";
import {Box} from "@mui/material";
import UserHeader from "./UserHeader.tsx";
import UserFooter from "./UserFooter.tsx";

function UserLayout() {
  return (
    <Box sx={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
      <UserHeader/>
      <Box sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <Outlet/>
      </Box>
      <UserFooter/>
    </Box>
  );
}

export default UserLayout;
