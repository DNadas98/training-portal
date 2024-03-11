import React from "react";
import {Avatar, Button, Card, CardContent, Grid, Stack, Typography} from "@mui/material";
import {DomainAddOutlined} from "@mui/icons-material";
import CompanyNameInput from "../../../components/CompanyNameInput.tsx";
import CompanyDescriptionInput from "../../../components/CompanyDescriptionInput.tsx";

interface AddCompanyFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export default function AddCompanyForm(props: AddCompanyFormProps) {
  return (
    <Grid container justifyContent={"center"}>
      <Grid item xs={10} sm={8} md={7} lg={6}>
        <Card sx={{
          paddingTop: 4, textAlign: "center",
          maxWidth: 800, width: "100%",
          marginLeft: "auto", marginRight: "auto"
        }}>
          <Stack
            spacing={2}
            alignItems={"center"}
            justifyContent={"center"}>
            <Avatar variant={"rounded"}
                    sx={{backgroundColor: "secondary.main"}}>
              <DomainAddOutlined/>
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Add new company
            </Typography>
          </Stack>
          <CardContent sx={{justifyContent: "center", textAlign: "center"}}>
            <Grid container sx={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              gap: "2rem"
            }}>
              <Grid item xs={10} sm={9} md={7} lg={6}
                    sx={{borderColor: "secondary.main"}}>
                <form onSubmit={props.onSubmit}>
                  <Stack spacing={2}>
                    <CompanyNameInput/>
                    <CompanyDescriptionInput/>
                    <Button type={"submit"}
                            variant={"contained"}>
                      Add Company
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
