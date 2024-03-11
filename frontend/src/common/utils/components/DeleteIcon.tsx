import {Avatar} from "@mui/material";
import {ClearOutlined} from "@mui/icons-material";


export default function DeleteIcon() {
  return (
    <Avatar variant={"rounded"} sx={{
      backgroundColor: "error.main",
      height: "1.25rem",
      width: "1.25rem"
    }}>
      <ClearOutlined/>
    </Avatar>
  )
}
