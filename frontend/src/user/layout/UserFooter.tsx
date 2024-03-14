import {AppBar, Toolbar, Typography} from "@mui/material";
import {AccountBoxRounded, MenuOutlined} from "@mui/icons-material";
import siteConfig from "../../common/config/siteConfig.ts";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import {accountMenuItems} from "../../common/menu/accountMenuItems.tsx";
import {useAuthentication} from "../../authentication/hooks/useAuthentication.ts";
import {loggedInMenuItems} from "../../common/menu/loggedInMenuItems.tsx";

export default function UserFooter() {
  const currentYear = new Date().getFullYear();
  const {siteName} = siteConfig;
  const authentication = useAuthentication();
  return (
    <AppBar position="sticky"
            color="primary"
            sx={{top: "auto", bottom: 0, marginTop: 4}}>
      <Toolbar sx={{justifyContent: "center", flexWrap: "wrap"}}>
        <MenuSmall items={loggedInMenuItems} icon={<MenuOutlined/>}/>
        <MenuSmall items={accountMenuItems}
                   title={(authentication.getUsername() as string)}
                   icon={<AccountBoxRounded/>}/>
        <Typography mr={1} mt={0.3} sx={{whitespace: "pre-wrap"}}>
          {currentYear}{" "}&copy;{" "}{siteName}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
