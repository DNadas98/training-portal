import {AppBar, Box, Toolbar} from "@mui/material";
import ThemePaletteModeSwitch from "../../common/theme/components/ThemePaletteModeSwitch.tsx";
import SiteLogo from "../../common/utils/components/SiteLogo.tsx";
import LocaleMenu from "../../common/menu/LocaleMenu.tsx";
import PublicMenu from "../../common/menu/PublicMenu.tsx";

export default function PublicHeader() {

  return (
    <AppBar position="static" sx={{marginBottom: 4}}>
      <Toolbar>
        <SiteLogo/>
        <Box flexGrow={1}/>
        <PublicMenu/>
        <LocaleMenu/>
        <ThemePaletteModeSwitch/>
      </Toolbar>
    </AppBar>
  );
}
