import {AppBar, Box, Toolbar} from "@mui/material";
import ThemePaletteModeSwitch from "../../common/theme/components/ThemePaletteModeSwitch.tsx";
import MenuLarge from "../../common/utils/components/MenuLarge.tsx";
import SiteLogo from "../../common/utils/components/SiteLogo.tsx";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import {loggedInMenuItems} from "../../common/menu/loggedInMenuItems.tsx";
import {useAuthentication} from "../../authentication/hooks/useAuthentication.ts";
import {AccountBoxRounded, MenuOutlined} from "@mui/icons-material";
import {accountMenuItems} from "../../common/menu/accountMenuItems.tsx";
import LocaleMenu from "../../common/localization/components/LocaleMenu.tsx";
import IsSmallScreen from "../../common/utils/IsSmallScreen.tsx";

export default function AdminHeader() {
  const isSmallScreen = IsSmallScreen();
  const authentication = useAuthentication();
  return (
    <AppBar position="static" sx={{marginBottom: 4}}>
      <Toolbar>
        <SiteLogo/>
        <Box flexGrow={1}/>
        {isSmallScreen
          ? <MenuSmall items={loggedInMenuItems} icon={<MenuOutlined/>}/>
          : <MenuLarge items={loggedInMenuItems}/>
        }
        <MenuSmall items={accountMenuItems}
                   title={(authentication.getFullName() as string)}
                   icon={<AccountBoxRounded/>}/>
        <LocaleMenu/>
        <ThemePaletteModeSwitch/>
      </Toolbar>
    </AppBar>
  );
}
