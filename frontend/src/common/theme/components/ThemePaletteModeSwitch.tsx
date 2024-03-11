import {IconButton} from "@mui/material";
import useThemePaletteMode from "../context/ThemePaletteModeProvider.tsx";
import {DarkMode, LightMode} from "@mui/icons-material";

export default function ThemePaletteModeSwitch() {
  const {paletteMode, togglePaletteMode} = useThemePaletteMode();
  return (
    <IconButton size={"large"}
                edge="start"
                color={"inherit"}
                onClick={togglePaletteMode}>
      {paletteMode === "light"
        ? <LightMode/>
        : <DarkMode/>}
    </IconButton>
  );
}
