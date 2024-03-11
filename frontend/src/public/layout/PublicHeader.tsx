import {AppBar, Toolbar, Typography, useMediaQuery, useTheme} from "@mui/material";
import {IMenuRoutes} from "../../common/routing/IMenuRoutes.ts";
import {publicMenuRoutes} from "../../common/config/menu/publicMenuRoutes.tsx";
import ThemePaletteModeSwitch
  from "../../common/theme/components/ThemePaletteModeSwitch.tsx";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import MenuLarge from "../../common/utils/components/MenuLarge.tsx";
import siteConfig from "../../common/config/siteConfig.ts";

export default function PublicHeader() {
  const theme = useTheme();
  const {siteName} = siteConfig;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const menu: IMenuRoutes = publicMenuRoutes;

  return (
    <AppBar position="static" sx={{marginBottom: 4}}>
      <Toolbar>
        <Typography variant={"h6"} flexGrow={1}>
          {siteName}
        </Typography>
        {isSmallScreen
            ? <MenuSmall menu={menu}/>
            : <MenuLarge menu={menu}/>
        }
        <ThemePaletteModeSwitch/>
      </Toolbar>
    </AppBar>
  );
}
