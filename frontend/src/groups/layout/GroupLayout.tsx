import {Outlet} from "react-router-dom";
import {Box} from "@mui/material";
import UserHeader from "../../user/layout/UserHeader";
import UserFooter from "../../user/layout/UserFooter";

export default function GroupLayout() {
  return (
    <Box sx={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
      <UserHeader/>
      <Box sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column"
      }}>
        <Outlet/>
      </Box>
      <UserFooter/>
    </Box>
  );
}
