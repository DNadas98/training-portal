import {TextField} from "@mui/material";

interface ProjectDescriptionInputProps {
  description?: string;
}

export default function ProjectDescriptionInput(props: ProjectDescriptionInputProps) {

  return (
    <TextField
      placeholder={"Describe your project in a few lines"}
      name={"description"}
      defaultValue={props?.description ?? ""}
      required
      minRows={1}
      inputProps={{
        minLength: 1,
        maxLength: 255
      }}/>
  )
}
