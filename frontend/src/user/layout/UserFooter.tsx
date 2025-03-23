import { AppBar, Toolbar, Typography } from "@mui/material";
import LoggedInMenu from "../../common/menu/LoggedInMenu.tsx";
import AccountMenu from "../../common/menu/AccountMenu.tsx";

export default function UserFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <AppBar position="sticky"
      color="primary"
      sx={{ top: "auto", bottom: 0, marginTop: 4 }}>
      <Toolbar sx={{ justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        <LoggedInMenu menuStyle={"small"} />
        <AccountMenu />
        <Typography>{currentYear}{" "}&copy;{" "}{window.location.href.split("/")[2]}</Typography>
      </Toolbar>
    </AppBar>
  );
}
