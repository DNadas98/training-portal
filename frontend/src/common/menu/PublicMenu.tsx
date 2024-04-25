import useLocalized from "../localization/hooks/useLocalized.tsx";
import MenuSmall from "../utils/components/MenuSmall.tsx";
import {MenuOutlined} from "@mui/icons-material";
import MenuLarge from "../utils/components/MenuLarge.tsx";
import IsSmallScreen from "../utils/IsSmallScreen.tsx";
import {IMenuComponentProps} from "./IMenuComponentProps.ts";
import {IMenuItem} from "./IMenuItem.ts";

export default function PublicMenu(props: IMenuComponentProps) {
  const localized = useLocalized();
  const isSmallScreen = IsSmallScreen();
  const menuItems:IMenuItem[] = [
    {path: "/", title: localized("menus.home")},
    {path: "/login", title: localized("menus.sign_in")},
    {path: "/register", title: localized("menus.sign_up")}
  ];

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
