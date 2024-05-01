import {Button, Card, CardActions, CardContent, CardHeader, Grid, Stack, Typography,} from "@mui/material";
import UserQuestionnaireSubmissionList from "./UserQuestionnaireSubmissionList.tsx";
import {QuestionnaireSubmissionResponseDto} from "../../../../dto/QuestionnaireSubmissionResponseDto.ts";
import QuestionnaireSubmissionCard from "./QuestionnaireSubmissionCard.tsx";
import BackButton from "../../../../../common/utils/components/BackButton.tsx";
import URLQueryPagination from "../../../../../common/pagination/URLQueryPagination.tsx";
import {MouseEventHandler} from "react";
import useLocalized from "../../../../../common/localization/hooks/useLocalized.tsx";

interface UserQuestionnaireSubmissionBrowserProps {
  questionnaireSubmissions: QuestionnaireSubmissionResponseDto[],
  maxPointQuestionnaireSubmission: QuestionnaireSubmissionResponseDto | undefined,
  totalPages: number,
  page: number,
  size: number,

  onDeleteClick(id): void,

  onQuestionnaireSubmissionSelectClick: (id: number) => Promise<void>,
  selectedQuestionnaireSubmissionLoading: boolean,
  handleBackClick: MouseEventHandler<HTMLAnchorElement> | undefined | MouseEventHandler<HTMLButtonElement>
}

export default function UserQuestionnaireSubmissionBrowser(props: UserQuestionnaireSubmissionBrowserProps) {
  const localized = useLocalized();
  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      {props.maxPointQuestionnaireSubmission
        ? <Grid item xs={10} sm={10} md={9} lg={8}> <Stack spacing={2}>
          <Card>
            <CardHeader
              title={`${props.maxPointQuestionnaireSubmission.name} - ${localized("questionnaire.max_points")}`}/>
            <QuestionnaireSubmissionCard submission={props.maxPointQuestionnaireSubmission}/>
            <CardActions>
              <Button onClick={() => {
                props.onQuestionnaireSubmissionSelectClick(props.maxPointQuestionnaireSubmission.id as unknown as number)
              }}
                      disabled={props.selectedQuestionnaireSubmissionLoading}>
                {localized("common.view_details")}
              </Button>
            </CardActions>
          </Card>
        </Stack> </Grid> : <></>}
      <Grid item xs={10} sm={10} md={9} lg={8}>
        {props.questionnaireSubmissions?.length
          ? <Stack spacing={2}><Card>
            <CardContent>
              <Grid container spacing={1} justifyContent={"space-between"} alignItems={"baseline"}>
                <Grid item xs={12} md={true}>
                  <Typography variant={"h5"}>
                    {props.questionnaireSubmissions[0].name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={"auto"}>
                  <URLQueryPagination totalPages={props.totalPages}/>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
            <UserQuestionnaireSubmissionList questionnaireSubmissions={props.questionnaireSubmissions}
                                             onSelectClick={props.onQuestionnaireSubmissionSelectClick}
                                             selectedQuestionnaireSubmissionLoading={props.selectedQuestionnaireSubmissionLoading}
                                             maxPoints={false}
                                             onDeleteClick={props.onDeleteClick}/>
            <Card><CardActions>
              <BackButton text={localized("questionnaire.back_to_questionnaires")}/>
            </CardActions></Card>
          </Stack>
          : !props.maxPointQuestionnaireSubmission ? <Card>
            <CardHeader title={localized("questionnaire.no_submissions_found")}/>
            <CardContent sx={{justifyContent: "center"}}>
              <BackButton text={localized("questionnaire.back_to_questionnaires")}/>
            </CardContent>
          </Card> : <Card><CardActions>
              <BackButton text={localized("questionnaire.back_to_questionnaires")}/>
          </CardActions></Card>}
      </Grid>
    </Grid>
  );
}
