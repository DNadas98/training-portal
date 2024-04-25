import {AppBar, Toolbar, Typography} from "@mui/material";
import MenuSiteInfo from "../../common/utils/components/MenuSiteInfo.tsx";
import siteConfig from "../../common/config/siteConfig.ts";
import LoggedInMenu from "../../common/menu/LoggedInMenu.tsx";
import AccountMenu from "../../common/menu/AccountMenu.tsx";

export default function UserFooter() {
  const siteName = siteConfig.siteName;
  const currentYear = new Date().getFullYear();
  return (
    <AppBar position="sticky"
            color="primary"
            sx={{top: "auto", bottom: 0, marginTop: 4}}>
      <Toolbar sx={{justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>
        <LoggedInMenu menuStyle={"small"}/>
        <AccountMenu/>
        <MenuSiteInfo/>
        <Typography pt={0.5}>{currentYear}{" "}&copy;{" "}{siteName}</Typography>
      </Toolbar>
    </AppBar>
  );
}
