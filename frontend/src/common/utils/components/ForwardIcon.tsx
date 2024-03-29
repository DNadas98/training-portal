import {Avatar} from "@mui/material";
import {ChevronRight} from "@mui/icons-material";


export default function ForwardIcon() {
  return (
    <Avatar variant={"rounded"} sx={{
      backgroundColor: "secondary.main",
      color: "background.paper",
      height: "1.25rem",
      width: "1.25rem"
    }}>
      <ChevronRight color={"inherit"}/>
    </Avatar>
  )
}
