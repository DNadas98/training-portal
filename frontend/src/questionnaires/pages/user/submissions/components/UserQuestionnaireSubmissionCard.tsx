import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Checkbox,
  Divider,
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
import IsSmallScreen from "../../../../../common/utils/IsSmallScreen.tsx";
import RichTextDisplay from "../../../../../common/richTextEditor/RichTextDisplay.tsx";

interface UserQuestionnaireSubmissionCardProps {
  submission: QuestionnaireSubmissionResponseEditorDto;
}

export default function UserQuestionnaireSubmissionCard(props: UserQuestionnaireSubmissionCardProps) {
  const theme = useTheme();
  const getLocalizedDateTime = useLocalizedDateTime();
  const isSmallScreen = IsSmallScreen();
  return <Accordion key={props.submission.id} defaultExpanded={false}
                    variant={"elevation"}
                    sx={{paddingTop: 0.5, paddingBottom: 0.5}}>
    <AccordionSummary expandIcon={<ExpandIcon/>}><Stack spacing={0.5} width={"100%"}>
      <Grid container alignItems={"baseline"} spacing={1} justifyContent={"left"}>
        <Grid item xs={12} sm={"auto"}>
          <Typography variant={"h6"}>
            {props.submission.receivedPoints} / {props.submission.maxPoints} Points
          </Typography>
        </Grid>
        {!isSmallScreen ? <Grid item><Divider variant={"fullWidth"} orientation={"vertical"}/></Grid> : <></>}
        <Grid item xs={12} sm={"auto"}>
          <Typography variant={"body1"} sx={{
            wordBreak: "break-word",
            paddingRight: 1
          }}>
            {getLocalizedDateTime(new Date(props.submission.createdAt))}
          </Typography>
        </Grid>
        {!isSmallScreen ? <Grid item><Divider variant={"fullWidth"} orientation={"vertical"}/></Grid> : <></>}
        {props.submission.status
          ? <Grid item xs={12} sm={"auto"}>
            <Typography variant={"body1"} sx={{
              wordBreak: "break-word",
              paddingRight: 1
            }}> Submitted Status: {props.submission.status}
            </Typography>
          </Grid>
          : <></>}
      </Grid>
    </Stack> </AccordionSummary>
    <AccordionDetails>
      <RichTextDisplay content={props.submission.description}/>
      <Stack spacing={2} marginTop={2}>
        {props.submission.questions.map(question => <Card elevation={10} key={question.id}>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction={"row"} spacing={1} alignItems={"baseline"}>
                <Typography>{question.order}.</Typography>
                <RichTextDisplay content={question.text}/>
              </Stack>
              <Typography variant={"body2"}>
                Received Points: <strong> {question.receivedPoints} / {question.maxPoints}</strong>
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
