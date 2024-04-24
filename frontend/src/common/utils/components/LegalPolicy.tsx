import useLocalized from "../../localization/hooks/useLocalized.tsx";
import {Box, Typography} from "@mui/material";

export default function LegalPolicy() {
  const localized = useLocalized();
  const policyText = localized("site.legalPolicyText")
  return (<Box textAlign={"justify"}>
    <Typography variant={"body2"}>
      {policyText}
    </Typography>
  </Box>);
}
