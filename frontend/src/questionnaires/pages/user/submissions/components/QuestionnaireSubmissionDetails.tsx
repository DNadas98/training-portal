import {Card, CardContent, CardHeader, Checkbox, Grid, Radio, Stack, Typography, useTheme} from "@mui/material";
import RichTextDisplay from "../../../../../common/richTextEditor/RichTextDisplay.tsx";
import {SubmittedAnswerStatus} from "../../../../dto/SubmittedAnswerStatus.ts";
import {QuestionType} from "../../../../dto/QuestionType.ts";
import {QuestionnaireSubmissionResponseDetailsDto} from "../../../../dto/QuestionnaireSubmissionResponseDetailsDto.ts";
import QuestionnaireSubmissionCard from "./QuestionnaireSubmissionCard.tsx";
import useLocalized from "../../../../../common/localization/hooks/useLocalized.tsx";

interface QuestionnaireSubmissionDetailsProps {
  submission: QuestionnaireSubmissionResponseDetailsDto,
}

const QuestionnaireSubmissionDetails = (props: QuestionnaireSubmissionDetailsProps) => {
  const theme = useTheme();
  const localized = useLocalized();
  return (<Card>
    <CardHeader title={props.submission.name}/>
    <QuestionnaireSubmissionCard submission={props.submission}/>
    <CardContent>
      <Stack spacing={2}>
        <RichTextDisplay content={props.submission.description}/>
        {props.submission.questions.map(question => <Card elevation={10} key={question.id}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction={"row"} spacing={1} alignItems={"baseline"}>
                <Typography whiteSpace={"nowrap"} sx={{wordBreak:"keep-all"}}>{question.order}.</Typography>
                <RichTextDisplay content={question.text}/>
              </Stack>
              <Typography variant={"body2"}>
                {localized("questionnaire.received_points")}: <strong> {question.receivedPoints} / {question.maxPoints}</strong>
              </Typography>
              {question.answers.map(answer => (
                <Grid container key={answer.id} spacing={1}
                      justifyContent={"center"} alignItems={"baseline"}
                      sx={{
                        backgroundColor: answer.status === SubmittedAnswerStatus.CORRECT
                          ? theme.palette.success.main
                          : answer.status === SubmittedAnswerStatus.INCORRECT
                            ? theme.palette.error.main
                            : "inherit"
                      }}>
                  <Grid item>
                    {question.type === QuestionType.CHECKBOX ? (
                      <Checkbox disabled sx={{":disabled": {color: "inherit"}}}
                                checked={answer.status !== SubmittedAnswerStatus.UNCHECKED}
                      />
                    ) : (
                      <Radio disabled sx={{":disabled": {color: "inherit"}}}
                             checked={answer.status !== SubmittedAnswerStatus.UNCHECKED}
                      />
                    )}
                  </Grid>
                  <Grid item xs={true}>
                    <Stack spacing={0.5} direction={"row"}>
                      <Typography whiteSpace={"nowrap"} sx={{wordBreak:"keep-all"}} variant={"body1"}>
                        {String.fromCharCode(answer.order + 64)}:
                      </Typography>
                      <Typography variant={"body1"} gutterBottom>{answer.text}</Typography>
                    </Stack>
                  </Grid>
                </Grid>))}
            </Stack>
          </CardContent>
        </Card>)}
      </Stack>
    </CardContent>
  </Card>);
}
export default QuestionnaireSubmissionDetails;
