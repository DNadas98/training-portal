import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent, Divider, Stack,
  Typography
} from "@mui/material";
import ExpandIcon from "../../../../../common/utils/components/ExpandIcon.tsx";
import LoadingSpinner from "../../../../../common/utils/components/LoadingSpinner.tsx";
import {QuestionnaireResponseEditorDto} from "../../../../dto/QuestionnaireResponseEditorDto.ts";

interface QuestionnaireListProps {
  loading: boolean;
  questionnaires: QuestionnaireResponseEditorDto[];
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
              <Divider sx={{marginTop: 2, marginBottom: 2}}/>
              <Typography variant={"body2"}>
                Created
                at {questionnaire.createdAt.toLocaleString(navigator.language)} by {questionnaire.createdBy.username}
              </Typography>
              <Divider sx={{marginTop: 1, marginBottom: 1}}/>
              <Typography variant={"body2"}>
                Last updated
                at {questionnaire.updatedAt.toLocaleString(navigator.language)} by {questionnaire.updatedBy.username}
              </Typography>
              <Divider sx={{marginTop: 1, marginBottom: 1}}/>
              <Typography>Status: {questionnaire.status}</Typography>
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
                <Button sx={{textTransform: "none", color: "white"}}
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
            {"No questionnaires were found for this project."}
          </Typography>
        </CardContent>
      </Card>;


}
