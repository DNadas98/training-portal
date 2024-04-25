import BackButton from "../../../common/utils/components/BackButton.tsx";
import {Grid, Typography} from "@mui/material";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";

interface NotFoundProps {
  text?: string;
}

function NotFound(props: NotFoundProps) {
  const localized = useLocalized();
  return (
    <Grid container justifyContent="center">
      <Grid item justifyContent="center">
        <Typography variant="h6">
          {props.text ?? localized("pages.error.not_found.text")}
        </Typography>
        <Grid container spacing={1} mt={1} textAlign={"left"}>
          <Grid item>
            <BackButton path={"/"} text={localized("menus.home")}/>
          </Grid>
          <Grid item>
            <BackButton/>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default NotFound;
