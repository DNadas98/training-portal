import {Grid} from "@mui/material";
import {useRef} from "react";
import {LinkBubbleMenu, RichTextEditor, type RichTextEditorRef, TableBubbleMenu,} from "mui-tiptap";
import EditorMenuControls from "./EditorMenuControls";
import useExtensions from "./UseExtensions.tsx";

/**
 * @param name
 * @param defaultValue
 * @see https://react.dev/reference/react-dom/components/input#props
 */
interface RichTextEditorControlledProps {
  id: any,
  value: string,
  onChange: (currentValue: string) => void
}

/**
 * Basic implementation of a `mui-tiptap` Rich Text Editor to be used as an input of controlled React forms
 * @param props `id`, `value and `onChange` of a controlled form element
 * @see https://github.com/sjdemartini/mui-tiptap
 */
export default function RichTextEditorControlled(props: RichTextEditorControlledProps) {
  const extensions = useExtensions({});
  const rteRef = useRef<RichTextEditorRef>(null);

  return (
    <Grid id={props.id} container alignItems={"left"} justifyContent={"left"} textAlign={"left"}>
      <Grid item xs={12}>
        <RichTextEditor ref={rteRef}
                        extensions={extensions}
                        content={props.value}
                        editable={true}
                        onUpdate={() => {
                          if (rteRef?.current?.editor) {
                            const currentValue: string = rteRef.current.editor.getHTML();
                            props.onChange(currentValue);
                          }
                        }}
                        editorProps={{}}
                        renderControls={() => <EditorMenuControls/>}
                        RichTextFieldProps={{
                          variant: "outlined",
                          MenuBarProps: {
                            hide: false,
                          },
                        }}>
          {() => (
            <>
              <LinkBubbleMenu/>
              <TableBubbleMenu/>
            </>
          )}
        </RichTextEditor>
      </Grid>
    </Grid>
  );
}
