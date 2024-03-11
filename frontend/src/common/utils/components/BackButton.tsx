import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";

interface BackButtonProps {
  path?: string,
  text?: string,
  isFullWidth?: boolean
}

function BackButton({path, text, isFullWidth = false}: BackButtonProps) {
  const navigate = useNavigate();
  return (
    <Button type="button"
            variant="contained"
            fullWidth={isFullWidth}
            onClick={() => path ? navigate(path) : navigate(-1)}>
      {text ?? "Back"}
    </Button>
  );
}

export default BackButton;
