import {AppBar, Toolbar} from "@mui/material";
import {AccountBoxRounded, MenuOutlined} from "@mui/icons-material";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import {accountMenuItems} from "../../common/menu/accountMenuItems.tsx";
import {useAuthentication} from "../../authentication/hooks/useAuthentication.ts";
import {loggedInMenuItems} from "../../common/menu/loggedInMenuItems.tsx";
import MenuSiteInfo from "../../common/utils/components/MenuSiteInfo.tsx";

export default function UserFooter() {
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
        <MenuSiteInfo/>
      </Toolbar>
    </AppBar>
  );
}
