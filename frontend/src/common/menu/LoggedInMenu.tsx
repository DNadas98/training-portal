import useLocalized from "../localization/hooks/useLocalized.tsx";
import MenuSmall from "../utils/components/MenuSmall.tsx";
import {MenuOutlined} from "@mui/icons-material";
import MenuLarge from "../utils/components/MenuLarge.tsx";
import IsSmallScreen from "../utils/IsSmallScreen.tsx";
import {IMenuComponentProps} from "./IMenuComponentProps.ts";

export default function LoggedInMenu(props: IMenuComponentProps) {
  const localized = useLocalized();
  const isSmallScreen = IsSmallScreen();
  const menuItems = [
    {path: "/", title: localized("menus.home")},
    {path: "/groups", title: localized("menus.groups")}
  ]

  if (props?.menuStyle === "small") {
    return <MenuSmall items={menuItems} icon={<MenuOutlined/>}/>
  }
  if (props?.menuStyle === "large") {
    return <MenuLarge items={menuItems}/>
  }
  return isSmallScreen
    ? <MenuSmall items={menuItems} icon={<MenuOutlined/>}/>
    : <MenuLarge items={menuItems}/>
}
