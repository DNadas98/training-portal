import BackButton from "../../../common/utils/components/BackButton.tsx";
import {Grid, Typography} from "@mui/material";

interface NotFoundProps {
  text?: string;
}

function NotFound(props: NotFoundProps) {
  return (
    <Grid container justifyContent="center">
      <Grid item justifyContent="center">
        <Typography variant="h6">
          {props.text ?? "The page you are looking for does not exist."}
        </Typography>
        <Grid container spacing={1} mt={1} textAlign={"left"}>
          <Grid item>
            <BackButton path={"/"} text={"Home"}/>
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
