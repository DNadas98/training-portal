import {List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import {AccountBoxOutlined, FactCheckOutlined, GroupAddOutlined} from "@mui/icons-material";
import useLocalized from "../../../../common/localization/hooks/useLocalized.tsx";

export default function HomeList() {
  const localized = useLocalized();
  return <List>
    <ListItem>
      <ListItemIcon>
        <AccountBoxOutlined color={"secondary"}/>
      </ListItemIcon>
      <ListItemText>
        {localized("pages.home.p01")}
      </ListItemText>
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <GroupAddOutlined color={"secondary"}/>
      </ListItemIcon>
      <ListItemText>
        {localized("pages.home.p02")}
      </ListItemText>
    </ListItem>
    <ListItem>
      <ListItemIcon>
        <FactCheckOutlined color={"secondary"}/>
      </ListItemIcon>
      <ListItemText>
        {localized("pages.home.p03")}
      </ListItemText>
    </ListItem>
  </List>
}
