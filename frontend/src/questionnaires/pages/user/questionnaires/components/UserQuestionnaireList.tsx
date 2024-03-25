import {
  Accordion, AccordionActions, AccordionDetails, AccordionSummary, Card, CardContent, Stack, Typography
} from "@mui/material";
import ExpandIcon from "../../../../../common/utils/components/ExpandIcon.tsx";
import LoadingSpinner from "../../../../../common/utils/components/LoadingSpinner.tsx";
import {QuestionnaireResponseDto} from "../../../../dto/QuestionnaireResponseDto.ts";

interface UserQuestionnaireListProps {
  loading: boolean;
  questionnaires: QuestionnaireResponseDto[];
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
              <Stack spacing={2} direction={"row"} width={"100%"}>
              </Stack>
            </AccordionActions>
          </Accordion>
        </Card>;
      })
      : <Card>
        <CardContent>
          <Typography>
            {"No active questionnaire was found for this project. For more information, please consult the project description and the learning materials."}
          </Typography>
        </CardContent>
      </Card>;


}
