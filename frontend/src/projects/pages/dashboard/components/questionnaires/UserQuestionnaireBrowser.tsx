import {Button, Card, CardContent, CardHeader, Grid, Stack, TextField, Typography} from "@mui/material";
import {FormEvent, useRef} from "react";
import {QuestionnaireResponseDto} from "../../../../../questionnaires/dto/QuestionnaireResponseDto.ts";
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
  handleBackClick: () => void;
}

export default function UserQuestionnaireBrowser(props: UserQuestionnaireBrowserProps) {
  const scrollRef = useRef(null);
  const handleScroll = () => {
    const current = scrollRef.current as any;
    current?.scrollIntoView({behavior: "smooth"});
  };


  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={12}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={
              <Button variant={"text"}
                      ref={scrollRef} onClick={handleScroll} sx={{color: "inherit", padding: 0, textTransform: "none"}}>
                <Typography variant={"h6"}>Active Questionnaires</Typography>
              </Button>
            }/>
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
        <Grid item xs={12}>
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
                                   maxPoints={true}/>
          </Stack>
        </Grid> : <></>}
    </Grid>
  );
}
