import {useEffect, useState} from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid
} from "@mui/material";
import {Link as RouterLink} from "react-router-dom";
import {useAuthentication} from "../../../authentication/hooks/useAuthentication.ts";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";
import HomeList from "./components/HomeList.tsx";
import HomeHeader from "./components/HomeHeader.tsx";

const Home = () => {
  const [checked, setChecked] = useState(false);
  const authentication = useAuthentication();
  const username = authentication.getUsername();
  const isLoggedIn = username && username.length > 0;
  const localized = useLocalized();

  useEffect(() => {
    setChecked(true);
  }, []);

  return (
    <Grid container justifyContent={"center"}><Grid item xs={10} sm={8} md={7} lg={6}><Card
      sx={{paddingTop: 4}}>
      <HomeHeader/>
      <CardContent sx={{justifyContent: "center", textAlign: "center"}}>
        <Grid container justifyContent={"center"}>
          <Grid item sx={{maxWidth: "22rem"}}>
            <Collapse in={checked} {...(checked ? {timeout: 1000} : {})}>
              <HomeList/>
            </Collapse>
          </Grid>
        </Grid>
        {!isLoggedIn
          ? <CardActions sx={{justifyContent: "center"}}>
            <Grid spacing={1} container justifyContent={"center"}>
              <Grid item>
                <Button component={RouterLink}
                        to={"/login"}
                        variant={"contained"}>
                  {localized("menus.sign_in")}
                </Button>
              </Grid>
              <Grid item>
                <Button component={RouterLink}
                        to={"/register"}
                        variant={"contained"}>
                  {localized("menus.sign_up")}
                </Button>
              </Grid>
            </Grid>
          </CardActions> : <></>}
      </CardContent>
    </Card></Grid></Grid>
  );
};

export default Home;
