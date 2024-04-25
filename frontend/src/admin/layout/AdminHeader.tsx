import {AppBar, Box, Toolbar} from "@mui/material";
import ThemePaletteModeSwitch from "../../common/theme/components/ThemePaletteModeSwitch.tsx";
import SiteLogo from "../../common/utils/components/SiteLogo.tsx";
import LocaleMenu from "../../common/menu/LocaleMenu.tsx";
import LoggedInMenu from "../../common/menu/LoggedInMenu.tsx";
import AccountMenu from "../../common/menu/AccountMenu.tsx";

export default function AdminHeader() {
  return (
    <AppBar position="static" sx={{marginBottom: 4}}>
      <Toolbar>
        <SiteLogo/>
        <Box flexGrow={1}/>
        <LoggedInMenu/>
        <AccountMenu/>
        <LocaleMenu/>
        <ThemePaletteModeSwitch/>
      </Toolbar>
    </AppBar>
  );
}
