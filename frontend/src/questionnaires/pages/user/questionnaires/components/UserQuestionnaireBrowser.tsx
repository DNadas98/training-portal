import {Card, CardContent, CardHeader, Grid, Stack, TextField} from "@mui/material";
import {FormEvent} from "react";
import {QuestionnaireResponseDto} from "../../../../dto/QuestionnaireResponseDto.ts";
import UserQuestionnaireList from "./UserQuestionnaireList.tsx";

interface UserQuestionnaireBrowserProps {
  questionnairesLoading: boolean,
  questionnaires: QuestionnaireResponseDto[],
  handleQuestionnaireSearch: (event: FormEvent<HTMLInputElement>) => void,
  handleFillOutClick: (id: number) => void,
  handlePastSubmissionsClick: (id: number) => void,
  maxPointQuestionnaires: QuestionnaireResponseDto[],
  handleMaxPointQuestionnaireSearch: (event: any) => void,
  maxPointQuestionnairesLoading: boolean
}

export default function UserQuestionnaireBrowser(props: UserQuestionnaireBrowserProps) {
  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={10} sm={10} md={9} lg={8}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={"Active Questionnaires"} sx={{textAlign: "center"}}/>
            <CardContent>
              <TextField variant={"standard"} type={"search"}
                         label={"Search"}
                         fullWidth
                         onInput={props.handleQuestionnaireSearch}
              />
            </CardContent>
          </Card>
          <UserQuestionnaireList loading={props.questionnairesLoading}
                                 questionnaires={props.questionnaires}
                                 handleFillOutClick={props.handleFillOutClick}
                                 handlePastSubmissionsClick={props.handlePastSubmissionsClick}
                                 maxPoints={false}
          />
        </Stack>
      </Grid>
      {props.maxPointQuestionnaires?.length ?
        <Grid item xs={10} sm={10} md={9} lg={8}>
          <Stack spacing={2}>
            <Card>
              <CardHeader title={"Questionnaires With Max Points"} sx={{textAlign: "center"}}/>
              <CardContent>
                <TextField variant={"standard"} type={"search"}
                           label={"Search"}
                           fullWidth
                           onInput={props.handleQuestionnaireSearch}
                />
              </CardContent>
            </Card>
            <UserQuestionnaireList loading={props.maxPointQuestionnairesLoading}
                                   questionnaires={props.maxPointQuestionnaires}
                                   handleFillOutClick={props.handleFillOutClick}
                                   handlePastSubmissionsClick={props.handlePastSubmissionsClick}
                                   maxPoints={true}
            />
          </Stack>
        </Grid>:<></>}
    </Grid>
  );
}
