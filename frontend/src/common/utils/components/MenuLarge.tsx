import {Button, Stack} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {IMenuRoutes} from "../../routing/IMenuRoutes.ts";
import getMenuRoutePath from "../../routing/getMenuRoutePath.ts";

interface MenuLargeProps {
  menu: IMenuRoutes;
}

export default function MenuLarge({menu}: MenuLargeProps) {
  if (!menu?.elements?.length) {
    return <></>;
  }
  return (<Stack direction={"row"}>
    {menu.elements.map(el => {
      return (
        <Button key={el.path}
                component={RouterLink}
                to={getMenuRoutePath(menu, el.path)}
                color="inherit">
          {el.name}
        </Button>
      );
    })}
  </Stack>);
}
