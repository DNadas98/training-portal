import {Avatar} from "@mui/material";
import {ExpandMore} from "@mui/icons-material";


export default function ExpandIcon() {
  return (
    <Avatar variant={"rounded"} sx={{
      backgroundColor: "secondary.main",
      color: "background.paper",
      height: "1.25rem",
      width: "1.25rem"
    }}>
      <ExpandMore color={"inherit"}/>
    </Avatar>
  )
}
