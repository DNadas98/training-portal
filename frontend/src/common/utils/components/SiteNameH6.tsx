import {Button, Link} from "@mui/material";
import siteConfig from "../../config/siteConfig.ts";

export default function SiteNameH6() {
  const {siteName} = siteConfig;
  return (<Button component={Link} href={"/"}
                  fullWidth={false}
                  sx={{
                    maxWidth: "fit-content",
                    color: "inherit",
                    whiteSpace: "nowrap",
                    fontSize: {
                      xs: '1rem',
                      sm: '1.5rem'
                    }
                  }}>
    {siteName}
  </Button>)
}
