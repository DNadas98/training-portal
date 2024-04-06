import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography
} from "@mui/material";
import ExpandIcon from "../../../../../common/utils/components/ExpandIcon.tsx";
import LoadingSpinner from "../../../../../common/utils/components/LoadingSpinner.tsx";
import {QuestionnaireResponseEditorDto} from "../../../../dto/QuestionnaireResponseEditorDto.ts";
import {QuestionnaireStatus} from "../../../../dto/QuestionnaireStatus.ts";
import useLocalizedDateTime from "../../../../../common/localization/hooks/useLocalizedDateTime.tsx";
import RichTextDisplay from "../../../../../common/richTextEditor/RichTextDisplay.tsx";

interface QuestionnaireListProps {
  loading: boolean,
  questionnaires: QuestionnaireResponseEditorDto[],
  onEditClick: (questionnaireId: number) => unknown,
  onTestClick: (questionnaireId: number) => unknown,
  onViewTestsClick: (questionnaireId: number) => unknown,
  onDeleteClick: (questionnaireId: number) => void,
  handleStatisticClick: (questionnaireId: number) => void,
  isAdmin: boolean
}

export default function QuestionnaireList(props: QuestionnaireListProps) {
  const getLocalizedDateTime = useLocalizedDateTime();
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
                    Max Points: {questionnaire.maxPoints}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionSummary>
            <AccordionDetails>
              <RichTextDisplay content={questionnaire.description}/>
              <Divider sx={{marginTop: 2, marginBottom: 2}}/>
              <Typography variant={"body2"}>
                Created
                at {getLocalizedDateTime(questionnaire.createdAt)} by {questionnaire.createdBy.username}
              </Typography>
              <Divider sx={{marginTop: 1, marginBottom: 1}}/>
              <Typography variant={"body2"}>
                Last updated
                at {getLocalizedDateTime(questionnaire.updatedAt)} by {questionnaire.updatedBy.username}
              </Typography>
              <Divider sx={{marginTop: 1, marginBottom: 1}}/>
              <Typography>Status: {questionnaire.status}</Typography>
            </AccordionDetails>
            <AccordionActions>
              <Grid container spacing={1} width={"100%"}>
                <Grid item xs={12} md={6}>
                  <Button sx={{textTransform: "none"}}
                          fullWidth
                          variant={"contained"}
                          onClick={() => {
                            props.onEditClick(questionnaire.id);
                          }}>
                    Edit
                  </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Button sx={{textTransform: "none", color: "white"}}
                          fullWidth
                          variant={"contained"}
                          color={"error"}
                          onClick={() => {
                            props.onDeleteClick(questionnaire.id);
                          }}>
                    Delete
                  </Button>
                </Grid>
                {questionnaire.status !== QuestionnaireStatus.INACTIVE
                  ? <>
                    <Grid item xs={12} md={6}>
                      <Button sx={{textTransform: "none"}}
                              fullWidth
                              variant={"outlined"}
                              onClick={() => {
                                props.onTestClick(questionnaire.id);
                              }}>
                        Fill Out Questionnaire
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Button sx={{textTransform: "none"}}
                              fullWidth
                              variant={"outlined"}
                              onClick={() => {
                                props.onViewTestsClick(questionnaire.id);
                              }}>
                        View Past Submissions
                      </Button>
                    </Grid>
                  </>
                  : <></>}
              </Grid>
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
