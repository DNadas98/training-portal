import {Button, Grid, Typography} from "@mui/material";
import BackButton from "../../../common/utils/components/BackButton.tsx";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";

function ErrorPage() {
  const localized = useLocalized();
  return (
    <Grid container minHeight="100vh" minWidth={"100%"} textAlign={"left"}
          alignItems="center" justifyContent="center">
      <Grid item xs={10} lg={false}>
        <Typography variant="h4" gutterBottom>
          {localized("pages.error.errorPage.p01") ?? "An error has occurred."}
        </Typography>
        <Typography variant="h6" gutterBottom>
          {localized("pages.error.errorPage.p02") ?? "Return to the homepage or try again later."}
        </Typography>
        <Typography>
          {localized("pages.error.errorPage.p03") ?? "If the issue persists, please contact our support team."}
        </Typography>
        <Grid container spacing={1} mt={1} textAlign={"left"}>
          <Grid item>
            <Button href="/" type="button" variant={"contained"}>
              Home
            </Button>
          </Grid>
          <Grid item>
            <BackButton/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ErrorPage;
