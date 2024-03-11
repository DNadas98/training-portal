import {Button} from "@mui/material";

function OAuth2GoogleSignInButton() {
    const googleAuthorizationUrl = `${import.meta.env.VITE_OAUTH2_AUTHORIZATION_URL}/google`;
    return (
        < Button
            type="button"
            href={googleAuthorizationUrl}
            fullWidth
            variant="outlined"
            sx={{
              backgroundColor: "#ffffff",
              '&:hover': {
                backgroundColor: "#d1d1d1",
              },
              color: "#00010D",
              display: "flex",
              justifyContent: "space-between",
              textTransform: "none"
            }}
        >
          <img src="/googleIcon.svg" height={"22px"} alt={"Google"}/>
          Sign In with Google
        </Button>
    );
}

export default OAuth2GoogleSignInButton;
