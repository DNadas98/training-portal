import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card, CardActions,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {FormEvent} from "react";
import {QuestionnaireResponseEditorDto} from "../../../../dto/QuestionnaireResponseEditorDto.ts";
import useLocalizedDateTime from "../../../../../common/localization/hooks/useLocalizedDateTime.tsx";
import LoadingSpinner from "../../../../../common/utils/components/LoadingSpinner.tsx";
import ExpandIcon from "../../../../../common/utils/components/ExpandIcon.tsx";
import RichTextDisplay from "../../../../../common/richTextEditor/RichTextDisplay.tsx";

interface CoordinatorQuestionnaireBrowserProps {
  questionnairesLoading: boolean,
  questionnaires: QuestionnaireResponseEditorDto[],
  handleQuestionnaireSearch: (event: FormEvent<HTMLInputElement>) => void,
  handleStatisticClick: (questionnaireId: number) => void,
  handleBackClick: () => void
}

export default function CoordinatorQuestionnaireBrowser(props: CoordinatorQuestionnaireBrowserProps) {
  const getLocalizedDateTime = useLocalizedDateTime();
  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={10} sm={10} md={9} lg={8}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={"Questionnaire Statistics"} sx={{textAlign: "center"}}/>
            <CardContent>
              <TextField variant={"standard"} type={"search"}
                         label={"Search"}
                         fullWidth
                         onInput={props.handleQuestionnaireSearch}
              />
            </CardContent>
          </Card>
          {props.questionnairesLoading
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
                      <Stack spacing={2} width={"100%"}>
                        <Button sx={{textTransform: "none", width: "fit-content"}}
                                variant={"outlined"}
                                onClick={() => {
                                  props.handleStatisticClick(questionnaire.id);
                                }}>
                          Statistics
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
              </Card>
          }
          <Card><CardActions>
            <Button sx={{width:"fit-content"}} onClick={props.handleBackClick}>
              Back to project
            </Button>
          </CardActions></Card>
        </Stack>
      </Grid>
    </Grid>
  );
}
