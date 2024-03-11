import {createRoot} from "react-dom/client";
import {AppThemeProvider} from "./common/theme/context/AppThemeProvider.tsx";
import {
  AuthenticationProvider
} from "./authentication/context/AuthenticationProvider.tsx";
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "./react_buddy_dev";
import {
  ThemePaletteModeProvider
} from "./common/theme/context/ThemePaletteModeProvider.tsx";
import appRouter from "./common/routing/appRouter.tsx";
import {RouterProvider} from "react-router-dom";
import {
  NotificationProvider
} from "./common/notification/context/NotificationProvider.tsx";
import "./index.css"
import {DialogProvider} from "./common/dialog/context/DialogProvider.tsx";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement as HTMLElement);
const router = appRouter;

root.render(
  <DevSupport ComponentPreviews={ComponentPreviews} useInitialHook={useInitial}>
    <ThemePaletteModeProvider>
      <AppThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <NotificationProvider>
          <DialogProvider>
            <AuthenticationProvider>
              <RouterProvider router={router}/>
            </AuthenticationProvider>
          </DialogProvider>
        </NotificationProvider>
        </LocalizationProvider>
      </AppThemeProvider>
    </ThemePaletteModeProvider>
  </DevSupport>
);
