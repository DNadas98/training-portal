import {Avatar} from "@mui/material";
import {AddOutlined} from "@mui/icons-material";


export default function AddIcon() {
  return (
    <Avatar variant={"rounded"}
            sx={{
              backgroundColor: "secondary.main",
              color: "background.paper"
            }}>
      <AddOutlined color={"inherit"}/>
    </Avatar>
  )
}
