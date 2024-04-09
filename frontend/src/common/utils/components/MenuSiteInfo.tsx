import {Button, Divider, Menu, MenuItem, Link, Typography, Tooltip} from "@mui/material";
import {MouseEventHandler, useState} from "react";
import siteConfig from "../../config/siteConfig.ts";


export default function MenuSiteInfo() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const siteName = siteConfig.siteName;
  const currentYear = new Date().getFullYear();

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
          Site & Project Info
        </Typography>}>
        <Button
          variant="text"
          color="inherit"
          onClick={handleMenu}
          sx={{wordBreak: "break-all", paddingTop: 1, backgroundColor: "transparent"}}
        >
          <Typography>
            {currentYear}{" "}&copy;{" "}{siteName}
          </Typography>
        </Button>
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
        <Typography paddingLeft={2} paddingRight={2} paddingTop={1}>
          Training Portal
        </Typography>
        <Typography variant={"body2"} paddingLeft={2} paddingRight={2} paddingTop={1} paddingBottom={1}>
          Created by Dániel Nádas
        </Typography>
        <Divider/>
        <MenuItem component={Link} href={"https://dnadas.net"}
                  rel={"noopener noreferrer"} target={"_blank"}>
          Portfolio - dnadas.net
        </MenuItem>
        <MenuItem component={Link} href={"https://dnadas.net/contact"}
                  rel={"noopener noreferrer"} target={"_blank"}>
          Contacts - Dániel Nádas
        </MenuItem>
        <MenuItem component={Link} href={"https://github.com/DNadas98/training-portal/blob/master/README.md"}
                  rel={"noopener noreferrer"} target={"_blank"}>
          Project Description
        </MenuItem>
        <MenuItem component={Link} href={"https://github.com/DNadas98/training-portal"}
                  rel={"noopener noreferrer"} target={"_blank"}>
          Source Code
        </MenuItem>
        <MenuItem component={Link} href={"https://github.com/DNadas98/training-portal/issues"}
                  rel={"noopener noreferrer"} target={"_blank"}>
          Upcoming Features
        </MenuItem>
      </Menu>
    </>
  );
}
