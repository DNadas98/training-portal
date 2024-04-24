import useLocalized from "../../localization/hooks/useLocalized.tsx";
import {Typography} from "@mui/material";

export default function LegalPolicy() {
  const localized = useLocalized();
  const policyTextRows = localized("site.legalPolicyText").split("\n");
  return <>{policyTextRows.map(row => <Typography variant={"body2"}>
    {row}
  </Typography>)}</>
}
