import {Grid} from "@mui/material";
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
    <Grid container padding={1}>
      <Grid item xs={11}>
        <RichTextReadOnly extensions={extensions} content={props.content}/>
      </Grid>
    </Grid>
  );
}
