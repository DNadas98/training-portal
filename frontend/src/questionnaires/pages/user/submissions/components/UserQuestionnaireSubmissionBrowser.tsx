import {Card, CardContent, CardHeader, Grid, Stack,} from "@mui/material";
import UserQuestionnaireSubmissionList from "./UserQuestionnaireSubmissionList.tsx";
import {QuestionnaireSubmissionResponseDto} from "../../../../dto/QuestionnaireSubmissionResponseDto.ts";
import UserQuestionnaireSubmissionCard from "./UserQuestionnaireSubmissionCard.tsx";
import BackButton from "../../../../../common/utils/components/BackButton.tsx";

interface UserQuestionnaireSubmissionBrowserProps {
  questionnaireSubmissions: QuestionnaireSubmissionResponseDto[],
  maxPointQuestionnaireSubmission: QuestionnaireSubmissionResponseDto | undefined,
}

export default function UserQuestionnaireSubmissionBrowser(props: UserQuestionnaireSubmissionBrowserProps) {
  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      {props.maxPointQuestionnaireSubmission
        ? <Grid item xs={10} sm={10} md={9} lg={8}> <Stack spacing={2}>
          <Card>
            <CardHeader title={`${props.maxPointQuestionnaireSubmission.name} - Max Points`}
                        sx={{textAlign: "center"}}/>
            <UserQuestionnaireSubmissionCard submission={props.maxPointQuestionnaireSubmission}/>
          </Card>
        </Stack> </Grid> : <></>}
      <Grid item xs={10} sm={10} md={9} lg={8}>
        {props.questionnaireSubmissions?.length
          ? <Stack spacing={2}><Card>
            <CardHeader title={`${props.questionnaireSubmissions[0].name}`} sx={{textAlign: "center"}}/>
          </Card>
            <UserQuestionnaireSubmissionList questionnaireSubmissions={props.questionnaireSubmissions}
                                             maxPoints={false}
            />
          </Stack>
          : <Card>
            <CardHeader title={"No submissions were found for this questionnaire."}
                        sx={{textAlign: "center"}}/>
            <CardContent sx={{justifyContent: "center"}}>
              <BackButton text={"Back to questionnaires"}/>
            </CardContent>
          </Card>}
      </Grid>
    </Grid>
  );
}
