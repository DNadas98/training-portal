import OAuth2GoogleSignInButton from "./OAuth2GoogleSignInButton.tsx";
import OAuth2FacebookSignInButton from "./OAuth2FacebookSignInButton.tsx";
import OAuth2GithubSignInButton from "./OAuth2GithubSignInButton.tsx";
import {Stack, Typography} from "@mui/material";

export default function OAuth2Stack() {
  return (
    <Stack spacing={2}>
      <Typography sx={{marginBottom: 2}}>
        Sign In with Your Socials:
      </Typography>
      <OAuth2GoogleSignInButton/>
      <OAuth2FacebookSignInButton/>
      <OAuth2GithubSignInButton/>
    </Stack>
  )
}
