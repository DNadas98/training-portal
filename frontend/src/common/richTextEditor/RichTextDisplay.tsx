import {Box} from "@mui/material";
import {RichTextReadOnly} from "mui-tiptap";
import useExtensions from "./UseExtensions.tsx";

/**
 * @param content
 */
interface CustomRteEditorProps {
  content: string;
}

/**
 *
 * @param props
 * @see https://github.com/sjdemartini/mui-tiptap
 */
export default function RichTextDisplay(props: CustomRteEditorProps) {
  const extensions = useExtensions({});
  return (
    <Box>
      <RichTextReadOnly extensions={extensions} content={props.content}/>
    </Box>
  );
}
