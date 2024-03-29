import {createTheme, ThemeProvider} from "@mui/material/styles";
import {ReactNode, useMemo} from "react";
import {CssBaseline} from "@mui/material";
import useThemePaletteMode from "./ThemePaletteModeProvider.tsx";
import {darkPalette, lightPalette} from "../../config/colorPaletteConfig.ts";
import * as locales from '@mui/material/locale';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers";
import useLocaleContext from "../../localization/hooks/useLocaleContext.tsx";
import {enGB, hu} from "date-fns/locale";
import {Locale} from "date-fns"

interface AppThemeProviderProps {
  children: ReactNode;
}

export function AppThemeProvider({children}: AppThemeProviderProps) {
  const paletteMode = useThemePaletteMode().paletteMode;
  const {locale} = useLocaleContext();
  const theme = useMemo(() => createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 620, /* original: 600 */
        md: 960,
        lg: 1280,
        xl: 1920,
      }
    },
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
          standard: {color: "secondary"},
          colorInfo: {color: "secondary"},
          colorSuccess: {color: "success"},
          colorWarning: {color: "warning"},
          colorError: {color: "error"}
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

  const getDateFnsLocale = (locale): Locale => {
    switch (locale.toString().substring(0, 2)) {
      case "en":
        return enGB;
      case "hu":
        return hu;
      default:
        return hu;
    }
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getDateFnsLocale(locale) as Locale}>
      <ThemeProvider theme={createTheme(theme, locales[locale])}>
        <CssBaseline/>
        {children}
      </ThemeProvider>
    </LocalizationProvider>
  );
}
