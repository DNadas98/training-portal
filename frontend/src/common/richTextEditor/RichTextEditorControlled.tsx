import {debounce, Grid} from "@mui/material";
import {useCallback, useEffect, useRef} from "react";
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
  const rteRef = useRef<RichTextEditorRef>(null);
  const extensions = useExtensions({});


  const debouncedOnChange = useCallback(debounce((value) => {
    props.onChange(value);
  }, 600), [props.onChange]);

  useEffect(() => {
    return () => debouncedOnChange.clear();
  }, [debouncedOnChange]);

  const handleUpdate = useCallback(() => {
    if (rteRef?.current?.editor) {
      const currentValue = rteRef.current.editor.getHTML();
      debouncedOnChange(currentValue);
    }
  }, [debouncedOnChange]);

  return (
    <Grid id={props.id} container alignItems={"left"} justifyContent={"left"} textAlign={"left"}>
      <Grid item xs={12}>
        <RichTextEditor ref={rteRef}
                        extensions={extensions}
                        content={props.value}
                        editable={true}
                        onUpdate={handleUpdate}
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
