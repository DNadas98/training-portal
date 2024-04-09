import {AppBar, Toolbar} from "@mui/material";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import {publicMenuItems} from "../../common/menu/publicMenuItems.tsx";
import {MenuOutlined} from "@mui/icons-material";
import MenuSiteInfo from "../../common/utils/components/MenuSiteInfo.tsx";

export default function PublicFooter() {

  return (
    <AppBar position="sticky" color="primary" sx={{top: "auto", bottom: 0, marginTop: 4}}>
      <Toolbar sx={{justifyContent: "center", alignItems:"center"}}>
        <MenuSmall items={publicMenuItems} icon={<MenuOutlined/>}/>
        <MenuSiteInfo/>
      </Toolbar>
    </AppBar>
  );
}
