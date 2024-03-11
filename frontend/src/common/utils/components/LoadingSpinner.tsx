import ClipLoader from "react-spinners/ClipLoader";
import {Grid, useTheme} from "@mui/material";

function LoadingSpinner() {
  const color = useTheme()?.palette?.primary?.main ?? "";
  return (
    <Grid container justifyContent={"center"} alignItems={"center"}>
      <ClipLoader size={80} color={color}/>
    </Grid>
  );
}

export default LoadingSpinner;
