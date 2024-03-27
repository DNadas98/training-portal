import {AppBar, Box, Toolbar, useMediaQuery, useTheme} from "@mui/material";
import ThemePaletteModeSwitch
  from "../../common/theme/components/ThemePaletteModeSwitch.tsx";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import MenuLarge from "../../common/utils/components/MenuLarge.tsx";
import {publicMenuItems} from "../../common/menu/publicMenuItems.tsx";
import {MenuOutlined} from "@mui/icons-material";
import SiteNameH6 from "../../common/utils/components/SiteNameH6.tsx";
import LocaleMenu from "../../common/localization/components/LocaleMenu.tsx";

export default function PublicHeader() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="static" sx={{marginBottom: 4}}>
      <Toolbar>
        <SiteNameH6/>
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
