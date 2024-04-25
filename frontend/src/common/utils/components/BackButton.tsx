import {useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import useLocalized from "../../localization/hooks/useLocalized.tsx";

interface BackButtonProps {
  path?: string,
  text?: string,
  isFullWidth?: boolean
}

function BackButton({path, text, isFullWidth = false}: BackButtonProps) {
  const navigate = useNavigate();
  const localized = useLocalized();
  return (
    <Button type="button"
            variant="text"
            fullWidth={isFullWidth}
            onClick={() => path ? navigate(path) : navigate(-1)}>
      {text ?? localized("common.back")}
    </Button>
  );
}

export default BackButton;
