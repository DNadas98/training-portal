import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent, Stack,
  Typography
} from "@mui/material";
import {
  QuestionnaireResponseEditorDto
} from "../../../dto/QuestionnaireResponseEditorDto.ts";
import ExpandIcon from "../../../../common/utils/components/ExpandIcon.tsx";
import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";

interface QuestionnaireListProps {
  loading: boolean;
  questionnaires: QuestionnaireResponseEditorDto[];
  notFoundText: string;
  onEditClick: (questionnaireId: number) => unknown;
  onDeleteClick: (questionnaireId: number) => void;
}

export default function QuestionnaireList(props: QuestionnaireListProps) {

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
                <Button sx={{textTransform: "none"}}
                        fullWidth
                        variant={"contained"}
                        onClick={() => {
                          props.onEditClick(questionnaire.id);
                        }}>
                  Edit
                </Button>
                <Button sx={{textTransform: "none",color:"white"}}
                        fullWidth
                        variant={"contained"}
                        color={"error"}
                        onClick={() => {
                          props.onDeleteClick(questionnaire.id);
                        }}>
                  Delete
                </Button>
              </Stack>
            </AccordionActions>
          </Accordion>
        </Card>;
      })
      : <Card>
        <CardContent>
          <Typography>
            {props.notFoundText}
          </Typography>
        </CardContent>
      </Card>;


}
