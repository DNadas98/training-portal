import {AppBar, IconButton, Toolbar, Typography} from "@mui/material";
import {userMenuProfileRoutes} from "../../common/config/menu/userMenuProfileRoutes.tsx";
import {IMenuRoutes} from "../../common/routing/IMenuRoutes.ts";
import {GitHub} from "@mui/icons-material";
import siteConfig from "../../common/config/siteConfig.ts";
import MenuUserSmall from "../../common/utils/components/MenuUserSmall.tsx";
import {userMenuRoutes} from "../../common/config/menu/userMenuRoutes.tsx";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";

export default function UserFooter() {
  const currentYear = new Date().getFullYear();
  const {siteName, githubRepoUrl} = siteConfig;
  const menu: IMenuRoutes = userMenuProfileRoutes;
  const publicMenu:IMenuRoutes = userMenuRoutes;

  return (
    <AppBar position="sticky"
            color="primary"
            sx={{top: "auto", bottom: 0, marginTop: 4}}>
      <Toolbar sx={{justifyContent: "center", flexWrap: "wrap"}}>
        <MenuSmall menu={publicMenu}/>
        <MenuUserSmall menu={menu}/>
        <Typography mr={1} mt={0.3} sx={{whitespace: "pre-wrap"}}>
          {currentYear}{" "}&copy;{" "}{siteName}
        </Typography>
        <IconButton color={"inherit"}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={githubRepoUrl}>
          <GitHub/>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
