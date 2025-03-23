import { useTheme } from "@mui/material";
import {
  isTouchDevice,
  MenuButtonAddTable,
  MenuButtonBlockquote,
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonCode,
  MenuButtonCodeBlock,
  MenuButtonEditLink,
  MenuButtonHighlightColor,
  MenuButtonHorizontalRule,
  MenuButtonIndent,
  MenuButtonItalic,
  MenuButtonOrderedList,
  MenuButtonRedo,
  MenuButtonRemoveFormatting,
  MenuButtonStrikethrough,
  MenuButtonSubscript,
  MenuButtonSuperscript,
  MenuButtonTaskList,
  MenuButtonTextColor,
  MenuButtonUnderline,
  MenuButtonUndo,
  MenuButtonUnindent,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectFontFamily,
  MenuSelectFontSize,
  MenuSelectHeading,
  MenuSelectTextAlign,
} from "mui-tiptap";


/**
 * @param props
 * @see https://github.com/sjdemartini/mui-tiptap
 */
export default function EditorMenuControls() {
  const theme = useTheme();
  return (
    <MenuControlsContainer>
      <MenuSelectFontFamily
        options={[
          { label: "Arial", value: "Arial, sans-serif" },
          { label: "Calibri", value: "Calibri, sans-serif" },
          { label: "Garamond", value: "'Garamond', serif" },
          { label: "Helvetica", value: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
          { label: "Times New Roman", value: "'Times New Roman', serif" },
          { label: "Verdana", value: "Verdana, sans-serif" }
        ]}
      />
      <MenuDivider />

      <MenuSelectHeading />
      <MenuDivider />

      <MenuSelectFontSize />
      <MenuDivider />

      <MenuButtonBold />
      <MenuButtonItalic />
      <MenuButtonUnderline />
      <MenuButtonStrikethrough />
      <MenuButtonSubscript />
      <MenuButtonSuperscript />
      <MenuDivider />

      <MenuButtonTextColor
        defaultTextColor={theme.palette.text.primary}
        swatchColors={[
          { value: "#000000", label: "Black" },
          { value: "#ffffff", label: "White" },
          { value: "#888888", label: "Grey" },
          { value: "#ff0000", label: "Red" },
          { value: "#ff9900", label: "Orange" },
          { value: "#ffff00", label: "Yellow" },
          { value: "#00d000", label: "Green" },
          { value: "#0000ff", label: "Blue" },
        ]}
      />
      <MenuButtonHighlightColor
        swatchColors={[
          { value: "#595959", label: "Dark grey" },
          { value: "#dddddd", label: "Light grey" },
          { value: "#ffa6a6", label: "Light red" },
          { value: "#ffd699", label: "Light orange" },
          // Plain yellow matches the browser default `mark` like when using Cmd+Shift+H
          { value: "#ffff00", label: "Yellow" },
          { value: "#99cc99", label: "Light green" },
          { value: "#90c6ff", label: "Light blue" },
          { value: "#8085e9", label: "Light purple" },
        ]}
      />
      <MenuDivider />

      <MenuButtonEditLink />
      <MenuDivider />

      <MenuSelectTextAlign />
      <MenuDivider />

      <MenuButtonOrderedList />
      <MenuButtonBulletedList />
      <MenuButtonTaskList />
      {isTouchDevice() && (
        <>
          <MenuButtonIndent />

          <MenuButtonUnindent />
        </>
      )}
      <MenuDivider />

      <MenuButtonBlockquote />
      <MenuDivider />

      <MenuButtonHorizontalRule />
      <MenuButtonAddTable />
      <MenuDivider />

      <MenuButtonRemoveFormatting />
      <MenuDivider />

      <MenuButtonUndo />
      <MenuButtonRedo />
    </MenuControlsContainer>
  );
}
