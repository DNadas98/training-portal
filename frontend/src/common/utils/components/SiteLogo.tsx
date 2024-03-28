import {Button, IconButton, Link} from "@mui/material";
import siteConfig from "../../config/siteConfig.ts";
import IsSmallScreen from "../IsSmallScreen.tsx";

export default function SiteLogo() {
  const {siteName} = siteConfig;
  const isSmallScreen = IsSmallScreen();

  return (
    isSmallScreen
      ? <IconButton>
        <img src={"/logo.png"} width={30} height={30} alt={""}
             style={{borderRadius: "15%"}}/>
      </IconButton>
      : <Button
        component={Link}
        href={"/"}
        fullWidth={false}
        sx={{
          maxWidth: "fit-content",
          color: "inherit",
          whiteSpace: "nowrap",
          fontSize: {
            sm: '1rem',
            md: '1.5rem'
          }
        }}
      >
        {siteName}
      </Button>
  );
}
