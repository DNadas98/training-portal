import {Button, Checkbox, Stack, Typography} from "@mui/material";
import {useDialog} from "../../dialog/context/DialogProvider.tsx";
import useLocalized from "../../localization/hooks/useLocalized.tsx";
import LegalPolicy from "./LegalPolicy.tsx";
import {useState} from "react";
// import {useNotification} from "../../notification/context/NotificationProvider.tsx";

export default function LegalPolicyCheckbox() {
  const dialog = useDialog();
  // const notification=useNotification();
  const [hasRead,setHasRead]=useState<boolean>(false);
  const [accepted, setAccepted] = useState<boolean>(false);
  const localized = useLocalized();
  const handleDialogOpen = () => {
    setHasRead(true);
    dialog.openDialog({
      confirmText: "Accept", cancelText: "Close", onConfirm: () => {
        setAccepted(true);
      }, content: <LegalPolicy/>
    });
  }

  const handleChange=(e)=> {
    const currentChecked = e.target.checked;
    if (currentChecked&&!hasRead){
      return handleDialogOpen();
      // return notification.openNotification({type:"error",vertical:"top",horizontal:"center",
      // message:localized("inputs.legalPolicy_hasNotRead_error")});
    }
    setAccepted(currentChecked);
  }

  return (
    <Stack direction={"row"} alignItems={"center"} justifyContent={"left"} spacing={1} flexWrap={"wrap"}>
      <Checkbox name={"legalPolicyAccepted"} onChange={handleChange} checked={accepted} required/>
      <Typography variant={"body2"} alignItems={"baseline"}>
        {localized("inputs.i_accept_the")}{" "}
        <Button variant={"text"} sx={{textTransform: "none", p: 0, m: 0}} onClick={handleDialogOpen}>
          <Typography variant={"body2"} alignItems={"baseline"}>
            {localized("inputs.legalPolicy")}
          </Typography>
        </Button>
      </Typography>
    </Stack>
  );
}
