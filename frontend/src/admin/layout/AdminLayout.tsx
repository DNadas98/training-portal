import {Outlet} from "react-router-dom";
import {Box} from "@mui/material";
import UserFooter from "../../user/layout/UserFooter.tsx";
import AdminHeader from "./AdminHeader.tsx";

function AdminLayout() {
  return (
    <Box sx={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
      <AdminHeader/>
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

export default AdminLayout;
