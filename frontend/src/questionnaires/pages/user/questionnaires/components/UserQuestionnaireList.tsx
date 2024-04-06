import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography
} from "@mui/material";
import ExpandIcon from "../../../../../common/utils/components/ExpandIcon.tsx";
import LoadingSpinner from "../../../../../common/utils/components/LoadingSpinner.tsx";
import {QuestionnaireResponseDto} from "../../../../dto/QuestionnaireResponseDto.ts";
import RichTextDisplay from "../../../../../common/richTextEditor/RichTextDisplay.tsx";

interface UserQuestionnaireListProps {
  loading: boolean,
  questionnaires: QuestionnaireResponseDto[],
  handleFillOutClick: (id: number) => void,
  handlePastSubmissionsClick: (id: number) => void,
  maxPoints: boolean
}

export default function UserQuestionnaireList(props: UserQuestionnaireListProps) {
  const MAX_SUBMISSION_COUNT = 10
  return props.loading
    ? <LoadingSpinner/>
    : props.questionnaires?.length > 0
      ? props.questionnaires.map((questionnaire) => {
        return <Card key={questionnaire.id}>
          <Accordion defaultExpanded={false}
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
                  <Typography variant={"body1"} sx={{
                    wordBreak: "break-word",
                    paddingRight: 1
                  }}>
                    Past Submissions: {questionnaire.submissionCount}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant={"body1"} sx={{
                wordBreak: "break-word",
                paddingRight: 1
              }}>
                Max Points: {questionnaire.maxPoints}
              </Typography>
              <RichTextDisplay content={questionnaire.description}/>
            </AccordionDetails>
            <AccordionActions>
              {props.maxPoints
                ? <Button sx={{width: "fit-content"}} onClick={() => {
                  props.handlePastSubmissionsClick(questionnaire.id);
                }}>
                  View past submissions
                </Button>
                : <Stack spacing={0.5} width={"100%"}>
                  {Number(questionnaire.submissionCount) < MAX_SUBMISSION_COUNT ?
                    <Button sx={{width: "fit-content", textAlign: "left"}} onClick={() => {
                      props.handleFillOutClick(questionnaire.id);
                    }}>
                      Fill out this questionnaire
                    </Button> : <></>}
                  <Button sx={{width: "fit-content"}} onClick={() => {
                    props.handlePastSubmissionsClick(questionnaire.id);
                  }}>
                    View past submissions
                  </Button>
                </Stack>
              }</AccordionActions>
          </Accordion>
        </Card>;
      })
      : <Card>
        <CardContent>
          {props.maxPoints
            ? <Typography>
              {"You haven't submitted a questionnaire with maximum points for this project yet."}
            </Typography>
            : <Typography>
              {"There are no submittable questionnaires available for this project right now."}
            </Typography>
          }

        </CardContent>
      </Card>;


}
