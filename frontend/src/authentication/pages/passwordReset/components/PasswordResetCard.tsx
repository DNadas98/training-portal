import {Avatar, Button, Card, CardContent, Grid, Stack, Typography} from "@mui/material";
import {Lock} from "@mui/icons-material";
import EmailInput from "../../../components/inputs/EmailInput.tsx";
import {FormEvent} from "react";

interface PasswordResetCardProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

export default function PasswordResetCard({onSubmit}: PasswordResetCardProps) {
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
            <Avatar variant={"rounded"} sx={{backgroundColor: "secondary.main"}}>
              <Lock/>
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Request Password Reset
            </Typography>
          </Stack>
          <CardContent sx={{justifyContent: "center", textAlign: "center"}}>
            <Grid container sx={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              gap: "2rem"
            }}>
              <Grid item xs={12}
                    sx={{borderColor: "secondary.main"}}>
                <form onSubmit={onSubmit}>
                  <Stack spacing={2}>
                    <EmailInput/>
                    <Button type={"submit"}
                            variant={"contained"}>
                      Send Reset E-mail
                    </Button>
                  </Stack>
                </form>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
