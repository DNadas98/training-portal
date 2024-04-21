import {Avatar, Button, Card, CardContent, Grid, Stack, Typography} from "@mui/material";
import {Lock} from "@mui/icons-material";
import UsernameInput from "../../../components/inputs/UsernameInput.tsx";
import EmailInput from "../../../components/inputs/EmailInput.tsx";
import PasswordInput from "../../../components/inputs/PasswordInput.tsx";
import {FormEvent} from "react";

interface RegisterCardProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export default function RegisterCard({onSubmit}: RegisterCardProps) {
  return (
    <Grid container justifyContent={"center"}>
      <Grid item xs={10} sm={8} md={7} lg={6}>
        <Card sx={{
          paddingTop: 4, textAlign: "center",
          maxWidth: 500, width: "100%",
          marginLeft: "auto", marginRight: "auto"
        }}>
          <Stack
            spacing={2}
            alignItems={"center"}
            justifyContent={"center"}>
            <Avatar variant={"rounded"}
                    sx={{backgroundColor: "secondary.main"}}>
              <Lock/>
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Sign Up
            </Typography>
          </Stack>
          <CardContent sx={{justifyContent: "center", textAlign: "center"}}>
            <form onSubmit={onSubmit}>
              <Stack spacing={2}>
                <UsernameInput/>
                <EmailInput/>
                <PasswordInput autoComplete={"new-password"}/>
                <PasswordInput confirm={true}/>
                <Button type={"submit"}
                        variant={"contained"}>
                  Sign Up
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
