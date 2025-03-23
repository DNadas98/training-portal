import { AppBar, Toolbar, Typography } from "@mui/material";
import PublicMenu from "../../common/menu/PublicMenu.tsx";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <AppBar position="sticky" color="primary" sx={{ top: "auto", bottom: 0, marginTop: 4 }}>
      <Toolbar sx={{ justifyContent: "center", alignItems: "center" }}>
        <PublicMenu menuStyle={"small"} />
        <Typography>{currentYear}{" "}&copy;{" "}{window.location.href.split("/")[2]}</Typography>
      </Toolbar>
    </AppBar>
  );
}
