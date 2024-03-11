import {AppBar, Toolbar, useMediaQuery, useTheme} from "@mui/material";
import {IMenuRoutes} from "../../common/routing/IMenuRoutes.ts";
import ThemePaletteModeSwitch
  from "../../common/theme/components/ThemePaletteModeSwitch.tsx";
import {userMenuProfileRoutes} from "../../common/config/menu/userMenuProfileRoutes.tsx";
import MenuUserSmall from "../../common/utils/components/MenuUserSmall.tsx";
import {userMenuRoutes} from "../../common/config/menu/userMenuRoutes.tsx";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import MenuLarge from "../../common/utils/components/MenuLarge.tsx";
import SiteNameH6 from "../../common/utils/components/SiteNameH6.tsx";

export default function UserHeader() {
  const menu: IMenuRoutes = userMenuProfileRoutes;
  const publicMenu: IMenuRoutes = userMenuRoutes;
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="static" sx={{marginBottom: 4}}>
      <Toolbar>
        <SiteNameH6/>
        {isSmallScreen
          ? <MenuSmall menu={publicMenu}/>
          : <MenuLarge menu={publicMenu}/>
        }
        <MenuUserSmall menu={menu}/>
        <ThemePaletteModeSwitch/>
      </Toolbar>
    </AppBar>
  );
}
