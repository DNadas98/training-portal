import {Divider, IconButton, Menu, MenuItem, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {MouseEventHandler, useState} from "react";
import {IMenuRoutes} from "../../routing/IMenuRoutes.ts";
import {AccountBoxRounded} from "@mui/icons-material";
import {useAuthentication} from "../../../authentication/hooks/useAuthentication.ts";
import getMenuRoutePath from "../../routing/getMenuRoutePath.ts";

interface MenuUserSmallProps {
  menu: IMenuRoutes;
}

export default function MenuUserSmall({menu}: MenuUserSmallProps) {
  const username = useAuthentication().getUsername();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleMenu: MouseEventHandler<HTMLButtonElement> = (event) => {
    const target = event.currentTarget;
    setAnchorEl(target);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (<>
    <IconButton
      size="large"
      edge="start"
      color="inherit"
      onClick={handleMenu}
    >
      <AccountBoxRounded/>
    </IconButton>
    <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open={open}
      onClose={handleClose}
    >
      <Typography paddingLeft={2}
                  paddingRight={2}>
        {username}
      </Typography>
      <Divider/>
      {menu.elements.length ? menu.elements.map(el => {
        return <MenuItem key={el.path} onClick={handleClose}
                         component={RouterLink}
                         to={getMenuRoutePath(menu, el.path)}
        >
          {el.name}
        </MenuItem>;
      }) : <></>}
    </Menu>
  </>);
}
