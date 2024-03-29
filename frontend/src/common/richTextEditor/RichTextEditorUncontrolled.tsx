import {Box} from "@mui/material";
import {useEffect, useRef, useState} from "react";
import {
  LinkBubbleMenu,
  RichTextEditor,
  TableBubbleMenu,
  type RichTextEditorRef,
} from "mui-tiptap";
import EditorMenuControls from "./EditorMenuControls";
import useExtensions from "./UseExtensions.tsx";

/**
 * @param name
 * @param defaultValue
 * @see https://react.dev/reference/react-dom/components/input#props
 */
interface CustomRteEditorProps {
  name: string;
  defaultValue?: string;
}

/**
 * Basic implementation of a `mui-tiptap` Rich Text Editor to be used as an input of uncontrolled React forms
 * @param props `name` and `defaultValue` of an uncontrolled form element
 * @see https://github.com/sjdemartini/mui-tiptap
 */
export default function RichTextEditorUncontrolled(props: CustomRteEditorProps) {
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
    <Box>
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
      <input type="hidden" ref={hiddenInputRef} id={props.name} name={props.name}/>
    </Box>
  );
}
