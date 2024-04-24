import useLocalized from "../../localization/hooks/useLocalized.tsx";
import {Box, Typography} from "@mui/material";

export default function SiteInformation() {
  const localized = useLocalized();
  const siteInfoText = localized("site.siteInfoText");
  return (<Box p={0.5} textAlign={"justify"}>
    <Typography variant={"body2"}>
      {siteInfoText}
    </Typography>
  </Box>);
}
