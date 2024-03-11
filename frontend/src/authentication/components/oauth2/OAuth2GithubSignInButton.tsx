import Button from "@mui/material/Button";
import {GitHub} from "@mui/icons-material";

function OAuth2GithubSignInButton() {
    const githubAuthorizationUrl = `${import.meta.env.VITE_OAUTH2_AUTHORIZATION_URL}/github`;
    return (
        <Button
            type="button"
            href={githubAuthorizationUrl}
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#171515",
              '&:hover': {
                backgroundColor: "#010409",
              },
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              textTransform: "none"
            }}
        >
          <GitHub sx={{marginRight: 1}}/>Sign In with GitHub
        </Button>
    );
}

export default OAuth2GithubSignInButton;
