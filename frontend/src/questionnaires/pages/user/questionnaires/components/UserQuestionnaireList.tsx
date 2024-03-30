import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  Stack,
  Typography
} from "@mui/material";
import ExpandIcon from "../../../../../common/utils/components/ExpandIcon.tsx";
import LoadingSpinner from "../../../../../common/utils/components/LoadingSpinner.tsx";
import {QuestionnaireResponseDto} from "../../../../dto/QuestionnaireResponseDto.ts";

interface UserQuestionnaireListProps {
  loading: boolean,
  questionnaires: QuestionnaireResponseDto[],
  handleFillOutClick: (id: number) => void,
  handlePastSubmissionsClick: (id: number) => void,
  maxPoints: boolean
}

export default function UserQuestionnaireList(props: UserQuestionnaireListProps) {

  return props.loading
    ? <LoadingSpinner/>
    : props.questionnaires?.length > 0
      ? props.questionnaires.map((questionnaire) => {
        return <Card key={questionnaire.id}>
          <Accordion defaultExpanded={false}
                     variant={"elevation"}
                     sx={{paddingTop: 0.5, paddingBottom: 0.5}}>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Typography variant={"h6"} sx={{
                wordBreak: "break-word",
                paddingRight: 1
              }}>
                {questionnaire.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant={"body2"}>
                {questionnaire.description}
              </Typography>
            </AccordionDetails>
            <AccordionActions>
              {props.maxPoints
                ? <Button sx={{width: "fit-content"}} onClick={() => {
                  props.handlePastSubmissionsClick(questionnaire.id);
                }}>
                  View past submissions
                </Button>
                : <Stack spacing={0.5} width={"100%"}>
                  <Button sx={{width: "fit-content", textAlign: "left"}} onClick={() => {
                    props.handleFillOutClick(questionnaire.id);
                  }}>
                    Fill out this questionnaire
                  </Button>
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
              {"There are no active questionnaires available for this project right now."}
            </Typography>
          }

        </CardContent>
      </Card>;


}
