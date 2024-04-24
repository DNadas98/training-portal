import {Button, Tooltip} from "@mui/material";

interface CopyButtonProps{
  text:string
}
export default function CopyButton(props:CopyButtonProps){
  return (<Tooltip title={"Copy to clipboard"} arrow={true}>
    <Button
    variant={"text"} sx={{textTransform: "none", padding: 0}}
    onClick={() => navigator.clipboard.writeText(props.text).then()}>
    {props.text}
  </Button>
  </Tooltip>)
}
