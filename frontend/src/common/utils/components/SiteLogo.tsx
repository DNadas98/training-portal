import {Button, IconButton} from "@mui/material";
import siteConfig from "../../config/siteConfig.ts";
import IsSmallScreen from "../IsSmallScreen.tsx";
import {Link} from "react-router-dom";

export default function SiteLogo() {
  const {siteName} = siteConfig;
  const isSmallScreen = IsSmallScreen();

  return (
    isSmallScreen
      ? <IconButton component={Link} to={"/"}>
        <img src={"/logo.png"} width={30} height={30} alt={""}
             style={{borderRadius: "15%"}}/>
      </IconButton>
      : <Button
        component={Link}
        to={"/"}
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
