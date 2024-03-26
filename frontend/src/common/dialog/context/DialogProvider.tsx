import React, {createContext, ReactNode, useContext, useState} from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  useMediaQuery,
  useTheme
} from "@mui/material";
import {DialogStateDto} from "../dto/DialogStateDto.ts";

interface DialogContextType {
  openDialog: (newDialogState: DialogStateDto) => void;
}

const DialogContext: React.Context<DialogContextType> = createContext<DialogContextType>(
  {
    openDialog: () => {
    }
  });

export function useDialog() {
  return useContext(DialogContext);
}

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider = ({children}: DialogProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const initialState: DialogStateDto = {
    text: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: () => {
    },
    blockScreen: false
  }
  const [dialogState, setDialogState] = useState<DialogStateDto>({...initialState});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const openDialog = (newDialogState: DialogStateDto) => {
    setDialogState({
      text: newDialogState.text,
      confirmText: newDialogState.confirmText ?? "Confirm",
      cancelText: newDialogState.cancelText ?? "Cancel",
      onConfirm: newDialogState.onConfirm,
      blockScreen: newDialogState.blockScreen === true

    });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    dialogState.onConfirm();
    handleClose();
  };

  return (
    <DialogContext.Provider value={{openDialog}}>
      {children}
      <Dialog
        open={isOpen}
        onClose={handleClose}
        fullScreen={isMobile}
      >
        <DialogContent>
          <DialogContentText>
            {dialogState.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} autoFocus sx={{padding: 2}}>
            {dialogState.confirmText}
          </Button>
          <Button onClick={handleClose} sx={{margin: 2}}>
            {dialogState.cancelText}
          </Button>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
};
