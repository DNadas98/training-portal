import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Grid,
  Radio,
  Stack,
  Typography,
  useTheme
} from "@mui/material";
import ExpandIcon from "../../../../../common/utils/components/ExpandIcon.tsx";
import {SubmittedAnswerStatus} from "../../../../dto/SubmittedAnswerStatus.ts";
import {QuestionType} from "../../../../dto/QuestionType.ts";
import useLocalizedDateTime from "../../../../../common/localization/hooks/useLocalizedDateTime.tsx";
import {QuestionnaireSubmissionResponseEditorDto} from "../../../../dto/QuestionnaireSubmissionResponseEditorDto.ts";

interface UserQuestionnaireSubmissionCardProps {
  submission: QuestionnaireSubmissionResponseEditorDto;
}

export default function UserQuestionnaireSubmissionCard(props: UserQuestionnaireSubmissionCardProps) {
  const theme = useTheme();
  const getLocalizedDateTime = useLocalizedDateTime();
  return <Accordion key={props.submission.id} defaultExpanded={false}
                    variant={"elevation"}
                    sx={{paddingTop: 0.5, paddingBottom: 0.5}}>
    <AccordionSummary expandIcon={<ExpandIcon/>}><Stack spacing={0.5}>
      <Typography variant={"h6"} sx={{
        wordBreak: "break-word",
        paddingRight: 1
      }}>
        {getLocalizedDateTime(new Date(props.submission.createdAt))}
      </Typography>
      <Stack direction={"row"} spacing={2}>
        <Typography variant={"body1"} sx={{
          wordBreak: "break-word",
          paddingRight: 1
        }}>
          {props.submission.name}
        </Typography>
        <Typography variant={"body1"}>{props.submission.receivedPoints} / {props.submission.maxPoints}</Typography>
      </Stack>
      <Typography variant={"body2"} sx={{
        wordBreak: "break-word",
        paddingRight: 1
      }}>
        Submitted Status: {props.submission.status}
      </Typography>
    </Stack> </AccordionSummary>
    <AccordionDetails>
      <Typography variant={"body1"}>
        {props.submission.description}
      </Typography>
      <Stack spacing={2} marginTop={2}>
        {props.submission.questions.map(question => <Card elevation={10} key={question.id}>
          <CardHeader title={`${question.order}. ${question.text}`} titleTypographyProps={{variant: "body1"}}
                      subheader={<Typography variant={"body2"}>
                        Received Points: <strong> {question.receivedPoints} / {question.maxPoints}</strong>
                      </Typography>}/>
          <CardContent>
            <Stack spacing={2}>
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
                  <Grid item xs={2} sm={1}>
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
                  <Grid item xs={10} sm={11}>
                    <Typography variant={"body1"} gutterBottom>{answer.text}</Typography>
                  </Grid>
                </Grid>))}
            </Stack>
          </CardContent>
        </Card>)}
      </Stack>
    </AccordionDetails>
  </Accordion>;
}
