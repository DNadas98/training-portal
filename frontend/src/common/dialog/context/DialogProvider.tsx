import React, {createContext, ReactNode, useContext, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import {DialogStateDto} from "../dto/DialogStateDto.ts";
import IsSmallScreen from "../../utils/IsSmallScreen.tsx";

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
    content: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: () => {
    },
    blockScreen: false,
    oneActionOnly: false
  }
  const [dialogState, setDialogState] = useState<DialogStateDto>({...initialState});
  const isSmallScreen = IsSmallScreen();

  const openDialog = (newDialogState: DialogStateDto) => {
    setDialogState({
      content: newDialogState.content,
      confirmText: newDialogState.confirmText ?? "Confirm",
      cancelText: newDialogState.cancelText ?? "Cancel",
      onConfirm: newDialogState.onConfirm,
      blockScreen: newDialogState.blockScreen === true,
      oneActionOnly: newDialogState.oneActionOnly === true
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
        hideBackdrop={false}
        fullWidth={dialogState.blockScreen}
        fullScreen={isSmallScreen}
      >
        <DialogContent>
          {dialogState.content}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirm} autoFocus sx={{padding: 2}}>
            {dialogState.confirmText}
          </Button>
          {!dialogState.oneActionOnly
            ? <Button onClick={handleClose} sx={{margin: 2}}>
              {dialogState.cancelText}
            </Button>
            : <></>}
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
};
