import useLocalized from "../../localization/hooks/useLocalized.tsx";
import {Typography} from "@mui/material";

export default function LegalPolicyText() {
  const localized = useLocalized();
  const policyTextRows = localized("site.legalPolicyText").split("\n");
  return <>{policyTextRows.map(row => <Typography variant={"body2"}>
    {row}
  </Typography>)}
    <a href={"/downloads/adatkezelesi_tajekoztato.pdf"} target="_blank" rel="noopener noreferrer">
      {localized("site.privacyPolicyLink")}
    </a>
    <br/>
    <a href={"/downloads/muszaki_leiras.pdf"} target="_blank" rel="noopener noreferrer">
      {localized("site.technicalDescriptionLink")}
    </a>
  </>;
}
