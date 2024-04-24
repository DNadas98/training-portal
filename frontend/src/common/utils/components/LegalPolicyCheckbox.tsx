import {Button, Checkbox, Stack, Typography} from "@mui/material";
import {useDialog} from "../../dialog/context/DialogProvider.tsx";
import useLocalized from "../../localization/hooks/useLocalized.tsx";
import LegalPolicy from "./LegalPolicy.tsx";
import {useState} from "react";

export default function LegalPolicyCheckbox() {
  const dialog = useDialog();
  const [hasRead, setHasRead] = useState<boolean>(false);
  const [accepted, setAccepted] = useState<boolean>(false);
  const localized = useLocalized();
  const handleDialogOpen = () => {
    setHasRead(true);
    dialog.openDialog({
      confirmText: localized("common.accept"), cancelText: localized("common.close"), onConfirm: () => {
        setAccepted(true);
      }, content: <LegalPolicy/>
    });
  }

  const handleChange = (e) => {
    const currentChecked = e.target.checked;
    if (currentChecked && !hasRead) {
      return handleDialogOpen();
    }
    setAccepted(currentChecked);
  }

  return (
    <Stack direction={"row"} alignItems={"center"} justifyContent={"left"} spacing={0.5} flexWrap={"wrap"}>
      <Checkbox name={"legalPolicyAccepted"} onChange={handleChange} checked={accepted} required sx={{m: 0, p: 0}}/>
      <Typography variant={"body2"} alignItems={"baseline"}>
        {localized("inputs.i_accept_the")}{" "}
      </Typography>
      <Button variant={"text"} sx={{textTransform: "none", p: 0, m: 0}} onClick={handleDialogOpen}>
        <Typography variant={"body2"} alignItems={"baseline"}>
          {localized("inputs.legalPolicy")}
        </Typography>
      </Button>
    </Stack>
  );
}
