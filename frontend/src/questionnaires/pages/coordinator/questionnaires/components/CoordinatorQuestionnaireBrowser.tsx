import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardActions,
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
//import RichTextDisplay from "../../../../../common/richTextEditor/RichTextDisplay.tsx";
import useLocalized from "../../../../../common/localization/hooks/useLocalized.tsx";


interface CoordinatorQuestionnaireBrowserProps {
  questionnairesLoading: boolean,
  questionnaires: QuestionnaireResponseEditorDto[],
  handleQuestionnaireSearch: (event: FormEvent<HTMLInputElement>) => void,
  handleStatisticClick: (questionnaireId: number) => void,
  handleBackClick: () => void
}

export default function CoordinatorQuestionnaireBrowser(props: CoordinatorQuestionnaireBrowserProps) {
  const getLocalizedDateTime = useLocalizedDateTime();
  const localized = useLocalized();
  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={10} sm={10} md={9} lg={8}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={localized("statistics.questionnaire_statistics")}/>
            <CardContent>
              <TextField variant={"standard"} type={"search"}
                         label={localized("inputs.search")}
                         fullWidth
                         onInput={props.handleQuestionnaireSearch}
              />
            </CardContent>
          </Card>
          {props.questionnairesLoading
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
                          <Typography variant={"body1"} sx={{
                            wordBreak: "break-word",
                            paddingRight: 1
                          }}>
                            {localized("questionnaire.max_points")}: {questionnaire.maxPoints}
                          </Typography>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/*<RichTextDisplay content={questionnaire.description}/>*/}
                      <Divider sx={{marginTop: 2, marginBottom: 2}}/>
                      <Typography variant={"body2"}>
                        {localized("statistics.created_at")}: {getLocalizedDateTime(questionnaire.createdAt)} by {questionnaire.createdBy.fullName}
                      </Typography>
                      <Divider sx={{marginTop: 1, marginBottom: 1}}/>
                      <Typography variant={"body2"}>
                        {localized("statistics.updated_at")}: {getLocalizedDateTime(questionnaire.updatedAt)} by {questionnaire.updatedBy.fullName}
                      </Typography>
                      <Divider sx={{marginTop: 1, marginBottom: 1}}/>
                      <Typography>{localized("statistics.status")}: {questionnaire.status.toString() === "ACTIVE" ? localized("statistics.active") : localized("statistics.test")}</Typography>
                    </AccordionDetails>
                    <AccordionActions>
                      <Stack spacing={2} width={"100%"}>
                        <Button sx={{textTransform: "none", width: "fit-content"}}
                                variant={"contained"}
                                onClick={() => {
                                  props.handleStatisticClick(questionnaire.id);
                                }}>
                          {localized("statistics.statistics")}
                        </Button>
                      </Stack>
                    </AccordionActions>
                  </Accordion>
                </Card>;
              })
              : <Card>
                <CardContent>
                  <Typography>
                    {localized("questionnaire.no_questionnaires_found")}
                  </Typography>
                </CardContent>
              </Card>
          }
          <Card><CardActions>
            <Button sx={{width:"fit-content"}} onClick={props.handleBackClick}>
              {localized("statistics.back_to_project")}
            </Button>
          </CardActions></Card>
        </Stack>
      </Grid>
    </Grid>
  );
}
