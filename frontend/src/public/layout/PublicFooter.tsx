import {AppBar, Toolbar, Typography} from "@mui/material";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import {publicMenuItems} from "../../common/menu/publicMenuItems.tsx";
import {MenuOutlined} from "@mui/icons-material";
import MenuSiteInfo from "../../common/utils/components/MenuSiteInfo.tsx";
import siteConfig from "../../common/config/siteConfig.ts";

export default function PublicFooter() {
  const siteName = siteConfig.siteName;
  const currentYear = new Date().getFullYear();

  return (
    <AppBar position="sticky" color="primary" sx={{top: "auto", bottom: 0, marginTop: 4}}>
      <Toolbar sx={{justifyContent: "center", alignItems:"center"}}>
        <MenuSmall items={publicMenuItems} icon={<MenuOutlined/>}/>
        <MenuSiteInfo/>
        <Typography>{currentYear}{" "}&copy;{" "}{siteName}</Typography>
      </Toolbar>
    </AppBar>
  );
}
