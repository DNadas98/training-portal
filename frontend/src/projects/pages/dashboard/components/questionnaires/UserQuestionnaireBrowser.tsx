import {Grid, Stack} from "@mui/material";
import {FormEvent} from "react";
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
  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={12}>
        <Stack spacing={2}>
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
