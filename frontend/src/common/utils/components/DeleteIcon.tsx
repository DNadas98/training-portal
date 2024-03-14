import {Avatar} from "@mui/material";
import {ClearOutlined} from "@mui/icons-material";


interface DeleteIconProps {
  disabled?: boolean
}

export default function DeleteIcon({disabled}: DeleteIconProps) {
  return (
    <Avatar variant={"rounded"} sx={{
      backgroundColor: disabled?"":"error.main",
      color:"background.paper"
    }}>
      <ClearOutlined/>
    </Avatar>
  )
}
