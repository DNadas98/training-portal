import {Button, Tooltip} from "@mui/material";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";

interface CopyButtonProps{
  text:string
}
export default function CopyButton(props:CopyButtonProps){
  const localized = useLocalized();
  return (<Tooltip title={localized("common.copy_to_clipboard")} arrow={true}>
    <Button
    variant={"text"} sx={{textTransform: "none", padding: 0}}
    onClick={() => navigator.clipboard.writeText(props.text).then()}>
    {props.text}
  </Button>
  </Tooltip>)
}
