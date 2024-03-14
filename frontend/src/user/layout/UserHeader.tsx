import {AppBar, Toolbar, useMediaQuery, useTheme} from "@mui/material";
import ThemePaletteModeSwitch
  from "../../common/theme/components/ThemePaletteModeSwitch.tsx";
import MenuLarge from "../../common/utils/components/MenuLarge.tsx";
import SiteNameH6 from "../../common/utils/components/SiteNameH6.tsx";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import {loggedInMenuItems} from "../../common/menu/loggedInMenuItems.tsx";
import {useAuthentication} from "../../authentication/hooks/useAuthentication.ts";
import {AccountBoxRounded, MenuOutlined} from "@mui/icons-material";
import { accountMenuItems } from "../../common/menu/accountMenuItems.tsx";

export default function UserHeader() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const authentication = useAuthentication();
  return (
    <AppBar position="static" sx={{marginBottom: 4}}>
      <Toolbar>
        <SiteNameH6/>
        {isSmallScreen
          ? <MenuSmall items={loggedInMenuItems} icon={<MenuOutlined/>}/>
          : <MenuLarge items={loggedInMenuItems}/>
        }
        <MenuSmall items={accountMenuItems}
                   title={(authentication.getUsername() as string)}
                   icon={<AccountBoxRounded/>}/>
        <ThemePaletteModeSwitch/>
      </Toolbar>
    </AppBar>
  );
}
