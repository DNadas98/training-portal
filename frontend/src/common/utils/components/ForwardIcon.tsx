import {Avatar} from "@mui/material";
import {ChevronRight} from "@mui/icons-material";


export default function ForwardIcon() {
  return (
    <Avatar variant={"rounded"} sx={{
      color: "secondary.main",
      backgroundColor: "background.paper",
      height: "1.25rem",
      width: "1.25rem"
    }}>
      <ChevronRight color={"inherit"}/>
    </Avatar>
  )
}
