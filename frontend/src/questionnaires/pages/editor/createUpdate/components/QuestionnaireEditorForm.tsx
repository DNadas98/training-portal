import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import DraggableQuestionsList from "./DraggableQuestionsList.tsx";
import AddIcon from "../../../../../common/utils/components/AddIcon.tsx";
import {QuestionCreateRequestDto} from "../../../../dto/QuestionCreateRequestDto.ts";
import {FormEventHandler, MouseEventHandler} from "react";
import {QuestionnaireStatus} from "../../../../dto/QuestionnaireStatus.ts";

interface QuestionnaireEditorFormProps {
  name: string | undefined,
  setName: (name: string) => void,
  description: string | undefined,
  setDescription: (name: string) => void,
  onDragEnd: (result: any) => void,
  questions: QuestionCreateRequestDto[],
  addQuestion: MouseEventHandler<HTMLButtonElement> | undefined,
  handleQuestionChange: (qIndex: number, field: string, value: any) => void,
  removeQuestion: (index: number) => void,
  addAnswer: (index: number) => void,
  handleAnswerChange: (qIndex: number, aIndex: number, field: string, vale: any) => void,
  removeAnswer: (qIndex: number, aIndex: number) => void,
  handleSubmit: FormEventHandler<HTMLFormElement> | undefined,
  handleBackClick: MouseEventHandler<HTMLButtonElement> | undefined,
  isUpdatePage: boolean,
  setHasUnsavedChanges: (value: (((prevState: boolean) => boolean) | boolean)) => void,
  status: QuestionnaireStatus,
  setStatus: (value: QuestionnaireStatus) => void
}

export default function QuestionnaireEditorForm(props: QuestionnaireEditorFormProps) {
  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={10}>
        <Box component="form"
             onSubmit={props.handleSubmit}
             onChange={() => {
               props.setHasUnsavedChanges(true)
             }}>
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
                    fullWidth
                    label="Questionnaire Name"
                    value={props.name}
                    variant={"outlined"}
                    onChange={(e) => props.setName(e.target.value)}
                  />
                  <TextField
                    required
                    fullWidth
                    label="Description"
                    multiline
                    minRows={4}
                    value={props.description}
                    onChange={(e) => props.setDescription(e.target.value)}
                  />
                  <Grid container spacing={2} alignItems={"center"}>
                    <Grid item>
                      <Typography sx={{whiteSpace: "nowrap"}}>
                        Status:</Typography>
                    </Grid>
                    <Grid item>
                      <Select
                        value={props.status}
                        required
                        onChange={(e) => props.setStatus(e.target.value as QuestionnaireStatus)}
                      >
                        <MenuItem value={QuestionnaireStatus.INACTIVE}>Inactive</MenuItem>
                        <MenuItem value={QuestionnaireStatus.TEST}>Test</MenuItem>
                        <MenuItem value={QuestionnaireStatus.ACTIVE}>Active</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
            <DraggableQuestionsList onDragEnd={props.onDragEnd}
                                    questions={props.questions}
                                    handleQuestionChange={props.handleQuestionChange}
                                    removeQuestion={props.removeQuestion}
                                    addAnswer={props.addAnswer}
                                    handleAnswerChange={props.handleAnswerChange}
                                    removeAnswer={props.removeAnswer}/>
            <Card variant={"outlined"} sx={{width: "100%"}}>
              <CardContent>
                <Button startIcon={<AddIcon/>} onClick={props.addQuestion} fullWidth>
                  Add New Question
                </Button>
              </CardContent>
            </Card>
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
                      Back
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
