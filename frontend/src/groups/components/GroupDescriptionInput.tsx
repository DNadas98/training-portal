import {Grid} from "@mui/material";
import RichTextEditorUncontrolled from "../../common/richTextEditor/RichTextEditorUncontrolled.tsx";


interface GroupDescriptionInputProps {
  description?: string;
}

export default function GroupDescriptionInput(props: GroupDescriptionInputProps) {
  return (
    <Grid container alignItems={"left"} justifyContent={"left"} textAlign={"left"}>
      <Grid item xs={12}>
        <RichTextEditorUncontrolled name={"description"} defaultValue={props.description}/>
      </Grid>
    </Grid>
  )
}
