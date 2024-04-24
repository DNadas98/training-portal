import {AppBar, Toolbar, Typography} from "@mui/material";
import {AccountBoxRounded, MenuOutlined} from "@mui/icons-material";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import {accountMenuItems} from "../../common/menu/accountMenuItems.tsx";
import {useAuthentication} from "../../authentication/hooks/useAuthentication.ts";
import {loggedInMenuItems} from "../../common/menu/loggedInMenuItems.tsx";
import MenuSiteInfo from "../../common/utils/components/MenuSiteInfo.tsx";
import siteConfig from "../../common/config/siteConfig.ts";

export default function UserFooter() {
  const authentication = useAuthentication();
  const siteName = siteConfig.siteName;
  const currentYear = new Date().getFullYear();
  return (
    <AppBar position="sticky"
            color="primary"
            sx={{top: "auto", bottom: 0, marginTop: 4}}>
      <Toolbar sx={{justifyContent: "center", alignItems: "center", flexWrap: "wrap"}}>
        <MenuSmall items={loggedInMenuItems} icon={<MenuOutlined/>}/>
        <MenuSmall items={accountMenuItems}
                   title={(authentication.getFullName() as string)}
                   icon={<AccountBoxRounded/>}/>
        <MenuSiteInfo/>
        <Typography pt={0.5}>{currentYear}{" "}&copy;{" "}{siteName}</Typography>
      </Toolbar>
    </AppBar>
  );
}
