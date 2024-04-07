import {
  Box,
  Button,
  Card,
  CardContent,
  debounce,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import DraggableQuestionsList from "./DraggableQuestionsList.tsx";
import {QuestionRequestDto} from "../../../../dto/QuestionRequestDto.ts";
import {FormEventHandler, MouseEventHandler, useCallback, useState} from "react";
import {QuestionnaireStatus} from "../../../../dto/QuestionnaireStatus.ts";
import RichTextDynamicEditor from "../../../../../common/richTextEditor/RichTextDynamicEditor.tsx";

interface QuestionnaireEditorFormProps {
  onStatusChange(newStatus: QuestionnaireStatus): void;

  onNameChange(newName: string): void;

  name: string | undefined,
  setName: (name: string) => void,
  description: string | undefined,
  setDescription: (name: string) => void,
  status: QuestionnaireStatus,
  setStatus: (value: QuestionnaireStatus) => void,
  questions: QuestionRequestDto[],
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined,
  handleBackClick: MouseEventHandler<HTMLButtonElement> | undefined,
  isUpdatePage: boolean,

  onUpdateQuestions(updatedQuestions: QuestionRequestDto[]): any,
}

export default function QuestionnaireEditorForm(props: QuestionnaireEditorFormProps) {
  const [currentName, setCurrentName] = useState<string>(props.name ?? "");

  const onNameUpdate = debounce((changedName) => {
    props.setName(changedName)
  }, 100);

  const handleNameUpdate = useCallback((event) => {
    const newName = event.target.value;
    setCurrentName(newName);
    onNameUpdate(newName);
  }, [onNameUpdate]);
  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={10}>
        <Box component="form"
             onSubmit={props.handleSubmit}>
          <Stack spacing={1}>
            <Card variant={"outlined"} sx={{width: "100%"}}>
              <CardContent>
                <Stack spacing={2}>
                  <Typography variant="h5">
                    {props.isUpdatePage ? "Update Questionnaire" : "Add New Questionnaire"}
                  </Typography>
                  <TextField
                    required
                    autoFocus
                    inputProps={{length: {min: 1, max: 100}}}
                    fullWidth
                    label="Questionnaire Name"
                    value={currentName}
                    variant={"outlined"}
                    onChange={handleNameUpdate}
                  />
                  <RichTextDynamicEditor id={"questionnaire-description"} value={props.description ?? ""}
                                            onChange={(currentValue: string) => props.setDescription(currentValue)}/>
                  {props.isUpdatePage
                    ? <Grid container spacing={2} alignItems={"center"}>
                      <Grid item>
                        <Typography sx={{whiteSpace: "nowrap"}}>
                          Status:</Typography>
                      </Grid>
                      <Grid item>
                        <Select
                          value={props.status}
                          required
                          onChange={(e) => props.onStatusChange(e.target.value as QuestionnaireStatus)}
                        >
                          <MenuItem value={QuestionnaireStatus.INACTIVE}>Inactive</MenuItem>
                          <MenuItem value={QuestionnaireStatus.TEST}>Test</MenuItem>
                          <MenuItem value={QuestionnaireStatus.ACTIVE}>Active</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                    : <></>}
                </Stack>
              </CardContent>
            </Card>
            <DraggableQuestionsList questionsLength={props.questions.length} questions={props.questions}
                                    onUpdateQuestions={props.onUpdateQuestions}/>
            <Card variant={"outlined"} sx={{width: "100%"}}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={true}>
                    <Button type="submit" variant="contained" fullWidth>
                      Save Questionnaire
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={true}>
                    <Button
                      onClick={props.handleBackClick}
                      variant={"outlined"} fullWidth>
                      Back To Questionnaires
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
}
