import React from "react";
import {Avatar, Button, Card, CardContent, Grid, Stack, Typography} from "@mui/material";
import {DomainOutlined} from "@mui/icons-material";
import CompanyNameInput from "../../../components/CompanyNameInput.tsx";
import CompanyDescriptionInput from "../../../components/CompanyDescriptionInput.tsx";
import {CompanyResponsePrivateDto} from "../../../dto/CompanyResponsePrivateDto.ts";

interface UpdateCompanyFormProps {
  company:CompanyResponsePrivateDto;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
}

export default function UpdateCompanyForm(props: UpdateCompanyFormProps) {
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
              <DomainOutlined/>
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Update company details
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
                    <CompanyNameInput name={props.company.name}/>
                    <CompanyDescriptionInput description={props.company.description}/>
                    <Button type={"submit"}
                            variant={"contained"}>
                      Update company details
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
