import {useRef, useCallback, useEffect} from 'react';
import {debounce, Grid} from '@mui/material';
import { RichTextEditor, RichTextReadOnly, type RichTextEditorRef } from 'mui-tiptap';
import useExtensions from './UseExtensions.tsx';
import EditorMenuControls from './EditorMenuControls';
import { useDialog } from "../dialog/context/DialogProvider.tsx";

interface RichTextDynamicEditorProps {
  id: any;
  value: string;
  onChange: (currentValue: string) => void;
}

const RichTextDynamicEditor = (props: RichTextDynamicEditorProps) => {
  const rteRef = useRef<RichTextEditorRef>(null);
  const extensions = useExtensions({});
  const { openDialog } = useDialog();


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

  const handleEdit = useCallback(() => {
    openDialog({
      oneActionOnly: true,
      confirmText: "Close",
      onConfirm: () => {},
      content: (
        <RichTextEditor
          ref={rteRef}
          extensions={extensions}
          content={props.value}
          onUpdate={handleUpdate}
          autofocus
          editable={true}
          editorProps={{}}
          renderControls={() => <EditorMenuControls/>}
          RichTextFieldProps={{
            variant: "outlined",
            MenuBarProps: {
              hide: false,
            },
          }}
        />
      )
    });
  }, [openDialog, extensions, props.value, handleUpdate]);

  return (
    <Grid id={props.id} container padding={1} onClick={handleEdit}>
      <Grid item xs={11}>
        <RichTextReadOnly extensions={extensions} content={props.value}/>
      </Grid>
    </Grid>
  );
};

export default RichTextDynamicEditor;
