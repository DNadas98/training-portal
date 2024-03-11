import Button from "@mui/material/Button";
import {Facebook} from "@mui/icons-material";

function OAuth2FacebookSignInButton() {
  const facebookAuthorizationUrl = `${import.meta.env.VITE_OAUTH2_AUTHORIZATION_URL}/facebook`;
  return (
    <Button
      type="button"
      href={facebookAuthorizationUrl}
      fullWidth
      variant="contained"
      sx={{
        backgroundColor: "#1977f3",
        '&:hover': {
          backgroundColor: "#1154ad",
        },
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        textTransform: "none"
      }}
    >
      <Facebook sx={{marginRight: 1}}/>Sign In with Facebook
    </Button>
  );
}

export default OAuth2FacebookSignInButton;
