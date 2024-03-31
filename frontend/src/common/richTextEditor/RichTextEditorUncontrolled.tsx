import {Grid} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {LinkBubbleMenu, RichTextEditor, type RichTextEditorRef, TableBubbleMenu,} from "mui-tiptap";
import EditorMenuControls from "./EditorMenuControls";
import useExtensions from "./UseExtensions.tsx";

/**
 * @param name
 * @param defaultValue
 * @see https://react.dev/reference/react-dom/components/input#props
 */
interface RichTextEditorUncontrolledProps {
  name: string;
  defaultValue?: string;
}

/**
 * Basic implementation of a `mui-tiptap` Rich Text Editor to be used as an input of uncontrolled React forms
 * @param props `name` and `defaultValue` of an uncontrolled form element
 * @see https://github.com/sjdemartini/mui-tiptap
 */
export default function RichTextEditorUncontrolled(props: RichTextEditorUncontrolledProps) {
  const extensions = useExtensions({});
  const rteRef = useRef<RichTextEditorRef>(null);
  const [content, setContent] = useState(props.defaultValue ?? "");
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = content;
    }
  }, [content, props.name]);

  return (
    <Grid container alignItems={"left"} justifyContent={"left"} textAlign={"left"}>
      <Grid item xs={12}>
      <RichTextEditor ref={rteRef}
                      extensions={extensions}
                      content={content}
                      editable={true}
                      onUpdate={() => {
                        if (rteRef?.current?.editor) {
                          setContent(rteRef.current.editor.getHTML());
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
      <input type="hidden" ref={hiddenInputRef} id={props.name} name={props.name} required/>
      </Grid>
    </Grid>
  );
}
