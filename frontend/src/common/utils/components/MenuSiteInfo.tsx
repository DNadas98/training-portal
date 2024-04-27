import {Divider, Menu, MenuItem, Link, Typography, Tooltip, IconButton} from "@mui/material";
import {MouseEventHandler, useState} from "react";
import siteConfig from "../../config/siteConfig.ts";
import useLocalized from "../../localization/hooks/useLocalized.tsx";
import useLocaleContext from "../../localization/hooks/useLocaleContext.tsx";
import CopyButton from "./CopyButton.tsx";
import {InfoOutlined} from "@mui/icons-material";


export default function MenuSiteInfo() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const config = siteConfig;
  const {locale} = useLocaleContext();
  const localized = useLocalized();

  const handleMenu: MouseEventHandler<HTMLButtonElement> = (event) => {
    const target = event.currentTarget;
    setAnchorEl(target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={
        <Typography>
          {localized("menus.siteInfo")}
        </Typography>}>
        <IconButton
          onClick={handleMenu}
          sx={{mr:1,color:"inherit",wordBreak: "break-all", paddingTop: 1, backgroundColor: "transparent"}}
        >
          <InfoOutlined/>
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <Typography variant={"h6"} paddingLeft={2} paddingRight={2} paddingTop={1}>
          {config.siteName}
        </Typography>
        <Divider/>
        <Typography paddingLeft={2} paddingRight={2} paddingTop={1} paddingBottom={1}>
          {localized("site.administrator")}
        </Typography>
        <Typography variant={"body2"} paddingLeft={2} paddingRight={2} paddingTop={1} paddingBottom={1}>
          {locale?.startsWith("hu")
          ? config.adminInfo.name_hu
          : config.adminInfo.name_en}
        </Typography>
        <MenuItem>
          <CopyButton text={config.adminInfo.mail}/>
        </MenuItem>
        <Divider/>
        <Typography paddingLeft={2} paddingRight={2} paddingTop={1} paddingBottom={1}>
          {localized("site.developer")}
        </Typography>
        <Typography paddingLeft={2} paddingRight={2} paddingTop={1} paddingBottom={1}>
          {locale?.startsWith("hu")
          ? config.developerInfo.name_hu
          : config.developerInfo.name_en}
        </Typography>
        <MenuItem>
          <CopyButton text={config.developerInfo.mail}/>
        </MenuItem>
        <MenuItem component={Link} href={config.developerInfo.portfolioUrl}
                  rel={"noopener noreferrer"} target={"_blank"}>
          {config.developerInfo.portfolioTitle}
        </MenuItem>
        <Divider/>
        <MenuItem component={Link} href={config.sourceCodeUrl}
                  rel={"noopener noreferrer"} target={"_blank"}>
          {localized("site.sourceCode")}
        </MenuItem>
      </Menu>
    </>
  );
}
