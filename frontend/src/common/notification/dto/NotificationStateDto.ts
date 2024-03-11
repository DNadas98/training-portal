import {SnackbarOrigin} from "@mui/material/Snackbar";
import {AlertColor} from "@mui/material";

export interface NotificationStateDto extends SnackbarOrigin {
  message: string;
  open?: boolean;
  type: AlertColor;
  vertical: "top" | "bottom";
  horizontal: "left" | "center" | "right";
}
