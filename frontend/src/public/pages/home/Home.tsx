import {useEffect, useState} from "react";
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import siteConfig from "../../../common/config/siteConfig.ts";
import {AccountBoxOutlined, FactCheckOutlined, GroupAddOutlined,} from "@mui/icons-material";
import {Link as RouterLink} from "react-router-dom";
import {useAuthentication} from "../../../authentication/hooks/useAuthentication.ts";

const Home = () => {
  const {siteName} = siteConfig;
  const [checked, setChecked] = useState(false);
  const theme = useTheme();
  const authentication = useAuthentication();
  const username = authentication.getUsername();
  const isLoggedIn = username && username.length > 0;

  useEffect(() => {
    setChecked(true);
  }, []);

  return (
    <Grid container justifyContent={"center"}><Grid item xs={10} sm={8} md={7} lg={6}><Card
      sx={{paddingTop: 4}}>
      <Stack spacing={2} alignItems={"center"} justifyContent={"center"}>
        <Avatar variant={"rounded"} src={"/logo.png"} sx={{
          height: 120, width: 120, objectFit: "contain",
          filter: `drop-shadow(0 0 0.3em ${theme?.palette?.primary?.main})`
        }}/>
        <Typography variant="h4" gutterBottom>
          {siteName}
        </Typography>
      </Stack>
      <CardContent sx={{justifyContent: "center", textAlign: "center"}}>
        <Grid container justifyContent={"center"}>
          <Grid item sx={{maxWidth: "22rem"}}>
            <Collapse in={checked} {...(checked ? {timeout: 1000} : {})}>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <AccountBoxOutlined color={"secondary"}/>
                  </ListItemIcon>
                  <ListItemText>
                    Create an account and sign in
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <GroupAddOutlined color={"secondary"}/>
                  </ListItemIcon>
                  <ListItemText>
                    Request to join groups and projects
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FactCheckOutlined color={"secondary"}/>
                  </ListItemIcon>
                  <ListItemText>
                    Study the educational materials, then complete the questionnaires
                  </ListItemText>
                </ListItem>
              </List>
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
                  Sign in
                </Button>
              </Grid>
              <Grid item>
                <Button component={RouterLink}
                        to={"/register"}
                        variant={"contained"}>
                  Sign up
                </Button>
              </Grid>
            </Grid>
          </CardActions> : <></>}
      </CardContent>
    </Card></Grid></Grid>
  );
};

export default Home;
