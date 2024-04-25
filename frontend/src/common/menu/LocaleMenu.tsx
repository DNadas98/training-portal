import {useState} from 'react';
import {Divider, IconButton, Menu, MenuItem, Typography} from '@mui/material';
import {LanguageOutlined} from "@mui/icons-material";
import useLocalized from "../localization/hooks/useLocalized.tsx";
import useLocaleContext from "../localization/hooks/useLocaleContext.tsx";

const LocaleMenu = () => {
  const {locale, setLocale} = useLocaleContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const localized = useLocalized();

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLocaleChange = (newLocale) => {
    handleCloseMenu();
    setLocale(newLocale);
  };

  return (<>
    <IconButton color={"inherit"} onClick={handleOpenMenu}><LanguageOutlined/></IconButton>
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleCloseMenu}
    >
      <Typography paddingLeft={2} paddingRight={2}>{localized("menus.language.title")}</Typography>
      <Divider/>
      <MenuItem selected={locale.toString() === "enGB"}
                onClick={() => handleLocaleChange("enGB")}>
        {localized("menus.language.english")}
      </MenuItem>
      <MenuItem selected={locale.toString() === "huHU"}
                onClick={() => handleLocaleChange("huHU")}>
        {localized("menus.language.hungarian")}
      </MenuItem>
    </Menu>
  </>);
};

export default LocaleMenu;
