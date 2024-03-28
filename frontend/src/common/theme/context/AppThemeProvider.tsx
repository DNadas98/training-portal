import {createTheme, ThemeProvider} from "@mui/material/styles";
import {ReactNode, useMemo} from "react";
import {CssBaseline} from "@mui/material";
import useThemePaletteMode from "./ThemePaletteModeProvider.tsx";
import {darkPalette, lightPalette} from "../../config/colorPaletteConfig.ts";
import * as locales from '@mui/material/locale';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers";
import useLocaleContext from "../../localization/hooks/useLocaleContext.tsx";

interface AppThemeProviderProps {
  children: ReactNode;
}

export function AppThemeProvider({children}: AppThemeProviderProps) {
  const paletteMode = useThemePaletteMode().paletteMode;
  const {locale} = useLocaleContext();
  const theme = useMemo(() => createTheme({
    palette: paletteMode === "light"
      ? lightPalette
      : darkPalette,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            minWidth: "286px",
            overflowX: "auto"
          }
        }
      },
      MuiButton: {
        defaultProps: {
          color: "secondary"
        }
      },
      MuiAlert: {
        styleOverrides: {
          standardInfo: {color: "secondary"},
          standardSuccess: {color: "success"},
          standardWarning: {color: "warning"},
          standardError: {color: "error"}
        },
        defaultProps: {variant: "standard"}
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: "inherit",
            "&.Mui-checked": {
              "color": "inherit",
            }
          }
        }
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            color: "inherit",
            "&.Mui-checked": {
              "color": "inherit"
            }
          }
        }
      }
    }
  }), [paletteMode]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={locale as unknown as Locale}>
      <ThemeProvider theme={createTheme(theme, locales[locale])}>
        <CssBaseline/>
        {children}
      </ThemeProvider>
    </LocalizationProvider>
  );
}
