import React, {createContext, ReactNode, useContext} from "react";
import Snackbar from "@mui/material/Snackbar";
import {Alert} from "@mui/material";
import {NotificationStateDto} from "../dto/NotificationStateDto.ts";

interface NotificationProviderProps {
  children: ReactNode;
}

interface NotificationContextType {
  openNotification: (newState: NotificationStateDto) => void;
}

const NotificationContext: React.Context<NotificationContextType> = createContext<NotificationContextType>({
  openNotification: () => {
  }
});

export function NotificationProvider({children}: NotificationProviderProps) {
  const autohideDuration = 6000;

  const [notificationState, setNotificationState] = React.useState<NotificationStateDto>({
    open: false,
    type: "info",
    message: "",
    vertical: "top",
    horizontal: "center"
  });

  /**
   *
   * @param newState {NotificationStateDto}
   */
  const openNotification = (newState: NotificationStateDto) => {
    setNotificationState(() => {
      return {...newState, open: true}
    });
  };

  const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setNotificationState((prevState) => ({...prevState, open: false}));
  };

  return (
    <NotificationContext.Provider value={{openNotification}}>
      <Snackbar open={notificationState.open}
                autoHideDuration={autohideDuration}
                anchorOrigin={{
                  vertical: notificationState.vertical,
                  horizontal: notificationState.horizontal
                }}
                onClose={handleClose}>
        <Alert onClose={handleClose}
               severity={notificationState.type}>
          {notificationState.message}
        </Alert>
      </Snackbar>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
