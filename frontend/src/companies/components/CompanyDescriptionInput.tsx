import {styled, TextareaAutosize} from "@mui/material";

interface CompanyDescriptionInputProps {
  description?: string;
}

export default function CompanyDescriptionInput(props: CompanyDescriptionInputProps) {
  const CustomTextareaAutosize = styled(TextareaAutosize)(
    ({theme}) => `
  box-sizing: border-box;
  font-family: sans-serif;
  font-size: ${theme.typography.body2.fontSize};
  line-height: ${theme.typography.body2.lineHeight};
 
  resize: vertical;
  
  padding: 1rem 0.5rem;
  outline: 0;
  border-radius: 0.2rem;
  color: ${theme.palette.text.primary};
  background: ${theme.palette.background.paper};
  border: 1px solid rgba(00,00,00,0.3);
  overflow-y: visible;
  
  &::placeholder {
    color: ${theme.palette.text.primary};
    opacity: 1;
  }

  &:hover {
    border: 1px solid ${theme.palette.text.primary};
  }

  &:focus {
    border: 2px solid ${theme.palette.secondary.main};
  }
`,
  );
  return (
    <CustomTextareaAutosize
      color={"secondary"}
      placeholder={"Describe your company in a few lines"}
      name={"description"}
      defaultValue={props?.description ?? ""}
      required
      minRows={12}
      minLength={1}
      maxLength={500}/>
  )
}
