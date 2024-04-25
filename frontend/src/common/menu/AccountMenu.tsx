import useLocalized from "../localization/hooks/useLocalized.tsx";
import MenuSmall from "../utils/components/MenuSmall.tsx";
import {AccountBoxRounded} from "@mui/icons-material";
import {useAuthentication} from "../../authentication/hooks/useAuthentication.ts";

export default function AccountMenu() {
  const localized = useLocalized();
  const authentication = useAuthentication();
  const menuItems = [
    {path: "/user", title: localized("menus.profile")},
    {path: "/user/requests", title: localized("menus.join_requests")},
    {path: "/user/logout", title: localized("menus.sign_out")}
  ]

  return <MenuSmall items={menuItems}
                    title={(authentication.getFullName() as string)}
                    icon={<AccountBoxRounded/>}/>
}
