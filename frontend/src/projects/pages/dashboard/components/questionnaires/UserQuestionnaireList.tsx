import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import ExpandIcon from "../../../../../common/utils/components/ExpandIcon.tsx";
import LoadingSpinner from "../../../../../common/utils/components/LoadingSpinner.tsx";
import {QuestionnaireResponseDto} from "../../../../../questionnaires/dto/QuestionnaireResponseDto.ts";
import RichTextDisplay from "../../../../../common/richTextEditor/RichTextDisplay.tsx";
import useLocalized from "../../../../../common/localization/hooks/useLocalized.tsx";

interface UserQuestionnaireListProps {
  loading: boolean,
  questionnaires: QuestionnaireResponseDto[],
  handleFillOutClick: (id: number) => void,
  handlePastSubmissionsClick: (id: number) => void,
  maxPoints: boolean
}

export default function UserQuestionnaireList(props: UserQuestionnaireListProps) {
  const MAX_SUBMISSION_COUNT = 10;
  const localized = useLocalized();
  return props.loading
    ? <LoadingSpinner/>
    : props.questionnaires?.length > 0
      ? props.questionnaires.map((questionnaire, index) => {
        return <Card key={questionnaire.id}>
          <Accordion defaultExpanded={index === 0}
                     variant={"elevation"}
                     sx={{paddingTop: 0.5, paddingBottom: 0.5}}>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Grid container alignItems={"center"} justifyContent={"space-between"}>
                <Grid item xs={12} md={true}>
                  <Typography variant={"h6"} sx={{
                    wordBreak: "break-word",
                    paddingRight: 1
                  }}>
                    {questionnaire.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={"auto"}>
                  {!props.maxPoints ?
                    <Typography variant={"body1"} sx={{
                      wordBreak: "break-word",
                      paddingRight: 1
                    }}>
                      {localized("questionnaire.past_submission")}: {questionnaire.submissionCount}
                    </Typography> : <></>}
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant={"body1"} sx={{
                wordBreak: "break-word",
                paddingRight: 1
              }}>
                {localized("questionnaire.achievable_points")}: {questionnaire.maxPoints}
              </Typography>
              {props.maxPoints ? <Typography>
                  {localized("questionnaire.max_achieved")}
                </Typography>
                : (questionnaire?.submissionCount && questionnaire.submissionCount >= MAX_SUBMISSION_COUNT)
                  ? <Typography>
                    {localized("questionnaire.max_submission_count_reached")}
                  </Typography>
                  : <></>}
              <RichTextDisplay content={questionnaire.description}/>
            </AccordionDetails>
            <AccordionActions>
              {props.maxPoints
                ? <Button sx={{width: "fit-content"}} onClick={() => {
                  props.handlePastSubmissionsClick(questionnaire.id);
                }}>
                  {localized("inputs.view_past_submission")}
                </Button>
                : <Stack spacing={0.5} width={"100%"}>
                  {Number(questionnaire.submissionCount) < MAX_SUBMISSION_COUNT ?
                    <Button sx={{width: "fit-content", textAlign: "left"}} variant={"contained"} onClick={() => {
                      props.handleFillOutClick(questionnaire.id);
                    }}>
                      {localized("questionnaire.fill_out_this_questionnaire")}
                    </Button> : <></>}
                  <Button sx={{width: "fit-content"}} onClick={() => {
                    props.handlePastSubmissionsClick(questionnaire.id);
                  }}>
                    {localized("inputs.view_past_submission")}
                  </Button>
                </Stack>
              }</AccordionActions>
          </Accordion>
        </Card>;
      }) : <></>
}
