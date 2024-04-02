import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

interface DialogAlertProps {
  title: string;
  text?: string;
  buttonText: string;
  onClose: () => unknown;
}

export default function DialogAlert(props: DialogAlertProps) {
  return (
    <Dialog open={true} onClose={props.onClose}>
      <DialogTitle>
        {props.title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {props.text}
        </DialogContentText>
        <DialogActions>
          <Button onClick={props.onClose}>
            {props.buttonText}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
