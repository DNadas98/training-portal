import {AppBar, Box, Toolbar} from "@mui/material";
import ThemePaletteModeSwitch from "../../common/theme/components/ThemePaletteModeSwitch.tsx";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import MenuLarge from "../../common/utils/components/MenuLarge.tsx";
import {publicMenuItems} from "../../common/menu/publicMenuItems.tsx";
import {MenuOutlined} from "@mui/icons-material";
import SiteLogo from "../../common/utils/components/SiteLogo.tsx";
import LocaleMenu from "../../common/localization/components/LocaleMenu.tsx";
import IsSmallScreen from "../../common/utils/IsSmallScreen.tsx";

export default function PublicHeader() {
  const isSmallScreen = IsSmallScreen();

  return (
    <AppBar position="static" sx={{marginBottom: 4}}>
      <Toolbar>
        <SiteLogo/>
        <Box flexGrow={1}/>
        {isSmallScreen
          ? <MenuSmall items={publicMenuItems} icon={<MenuOutlined/>}/>
          : <MenuLarge items={publicMenuItems}/>
        }
        <LocaleMenu/>
        <ThemePaletteModeSwitch/>
      </Toolbar>
    </AppBar>
  );
}
