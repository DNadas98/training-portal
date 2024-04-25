import {AppBar, Toolbar, Typography} from "@mui/material";
import MenuSiteInfo from "../../common/utils/components/MenuSiteInfo.tsx";
import siteConfig from "../../common/config/siteConfig.ts";
import PublicMenu from "../../common/menu/PublicMenu.tsx";

export default function PublicFooter() {
  const siteName = siteConfig.siteName;
  const currentYear = new Date().getFullYear();

  return (
    <AppBar position="sticky" color="primary" sx={{top: "auto", bottom: 0, marginTop: 4}}>
      <Toolbar sx={{justifyContent: "center", alignItems: "center"}}>
        <PublicMenu menuStyle={"small"}/>
        <MenuSiteInfo/>
        <Typography>{currentYear}{" "}&copy;{" "}{siteName}</Typography>
      </Toolbar>
    </AppBar>
  );
}
