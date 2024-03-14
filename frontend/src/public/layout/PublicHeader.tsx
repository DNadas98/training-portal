import {AppBar, Toolbar, Typography, useMediaQuery, useTheme} from "@mui/material";
import ThemePaletteModeSwitch
  from "../../common/theme/components/ThemePaletteModeSwitch.tsx";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import MenuLarge from "../../common/utils/components/MenuLarge.tsx";
import siteConfig from "../../common/config/siteConfig.ts";
import {publicMenuItems} from "../../common/menu/publicMenuItems.tsx";
import {MenuOutlined} from "@mui/icons-material";

export default function PublicHeader() {
  const theme = useTheme();
  const {siteName} = siteConfig;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="static" sx={{marginBottom: 4}}>
      <Toolbar>
        <Typography variant={"h6"} flexGrow={1}>
          {siteName}
        </Typography>
        {isSmallScreen
            ? <MenuSmall items={publicMenuItems} icon={<MenuOutlined/>}/>
            : <MenuLarge items={publicMenuItems}/>
        }
        <ThemePaletteModeSwitch/>
      </Toolbar>
    </AppBar>
  );
}
