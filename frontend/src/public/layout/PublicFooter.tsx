import {AppBar, Toolbar, Typography} from "@mui/material";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import siteConfig from "../../common/config/siteConfig.ts";
import {publicMenuItems} from "../../common/menu/publicMenuItems.tsx";
import {MenuOutlined} from "@mui/icons-material";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const {siteName} = siteConfig;

  return (
    <AppBar position="sticky" color="primary" sx={{top: "auto", bottom: 0, marginTop: 4}}>
      <Toolbar sx={{justifyContent: "center"}}>
        <MenuSmall items={publicMenuItems} icon={<MenuOutlined/>}/>
        <Typography mr={2}>
          {currentYear}{" "}&copy;{" "}{siteName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
