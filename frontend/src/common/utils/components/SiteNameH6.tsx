import {Typography} from "@mui/material";
import siteConfig from "../../config/siteConfig.ts";

export default function SiteNameH6() {
  const {siteName} = siteConfig;
  return (<Typography variant={"h6"}
                      flexGrow={1}
                      sx={{
                        whiteSpace: "nowrap",
                        fontSize: {
                          xs: '1rem',
                          sm: '1.5rem'
                        }
                      }}>
    {siteName}
  </Typography>)
}
