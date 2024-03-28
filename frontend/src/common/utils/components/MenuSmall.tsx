import {Button, Divider, IconButton, Menu, MenuItem, Typography} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {MouseEventHandler, ReactNode, useState} from "react";
import {IMenuItem} from "../../menu/IMenuItem.ts";

interface TitleMenuProps {
  title?: string;
  icon?: ReactNode;
  items: IMenuItem[];
}

export default function MenuSmall(props: TitleMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu: MouseEventHandler<HTMLButtonElement> = (event) => {
    const target = event.currentTarget;
    setAnchorEl(target);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems:ReactNode[] = [];

  if (props.title) {
    menuItems.push(
      <Typography key="menu-title" paddingLeft={2} paddingRight={2}>
        {props.title}
      </Typography>,
      <Divider key="menu-divider" />
    );
  }

  menuItems.push(...props.items.map(item => (
    <MenuItem key={item.path} component={RouterLink} to={item.path}>
      {item.title}
    </MenuItem>
  )));

  return (
    <>
      {props?.icon ? (
        <IconButton
          size="large"
          color="inherit"
          onClick={handleMenu}
        >
          {props.icon}
        </IconButton>
      ) : (
        <Button
          variant="text"
          size="small"
          color="inherit"
          onClick={handleMenu}
          sx={{wordBreak:"break-all"}}
        >
          {props.title ?? "Menu"}
        </Button>
      )}
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
        {menuItems}
      </Menu>
    </>
  );
}
