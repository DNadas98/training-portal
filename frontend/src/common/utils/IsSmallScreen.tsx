import {useMediaQuery, useTheme} from "@mui/material";

export default function IsSmallScreen(): boolean {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm"));
}
