import {createTheme, ThemeProvider} from "@mui/material/styles";
import {ReactNode, useMemo} from "react";
import {CssBaseline} from "@mui/material";
import useThemePaletteMode from "./ThemePaletteModeProvider.tsx";
import {darkPalette, lightPalette} from "../../config/colorPaletteConfig.ts";
import * as locales from '@mui/material/locale';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers";
import useLocaleContext from "../../localization/hooks/useLocaleContext.tsx";
import {Locale} from "date-fns"
import {getDateFnsLocale} from "../../localization/utils/getDateFnsLocale.ts";

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
      MuiTypography: {
        defaultProps: {
          whiteSpace: "wrap",
        },
        styleOverrides: {
          root: {
            wordBreak: "break-word"
          }
        }
      },
      MuiButton: {
        defaultProps: {
          color: "secondary",
        },
        styleOverrides: {
          root: {
            "&.Mui-disabled": {
              opacity: 1,
              color: "unset"
            }
          }
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
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: "inherit",
            "&.Mui-focused": {
              color: "inherit"
            }
          }
        }
      },
      MuiCheckbox: {
        styleOverrides: {
          root: {
            color: "inherit",
            "&.Mui-checked": {
              "color": "inherit"
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
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getDateFnsLocale(locale) as Locale}>
      <ThemeProvider theme={createTheme(theme, locales[locale])}>
        <CssBaseline/>
        {children}
      </ThemeProvider>
    </LocalizationProvider>
  );
}
