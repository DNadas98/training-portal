import {Button, Stack} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {IMenuItem} from "../../menu/IMenuItem.ts";

interface MenuLargeProps {
  items: IMenuItem[];
}

export default function MenuLarge(props: MenuLargeProps) {
  if (!props.items?.length) {
    return <></>;
  }
  return (<Stack direction={"row"}>
    {props.items.map(item => {
      return (
        <Button key={item.path}
                component={RouterLink}
                to={item.path}
                color="inherit">
          {item.title}
        </Button>
      );
    })}
  </Stack>);
}
