import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import {QuestionType} from "../../../../dto/QuestionType.ts";
import {QuestionCreateRequestDto} from "../../../../dto/QuestionCreateRequestDto.ts";
import DraggableQuestionAnswersList from "./DraggableQuestionAnswersList.tsx";
import DeleteIcon from "../../../../../common/utils/components/DeleteIcon.tsx";
import AddIcon from "../../../../../common/utils/components/AddIcon.tsx";
import IsSmallScreen from "../../../../../common/utils/IsSmallScreen.tsx";
import RichTextEditorControlled from "../../../../../common/richTextEditor/RichTextEditorControlled.tsx";

interface DraggableQuestionsListProps {
  onDragEnd: (result: any) => void;
  questions: QuestionCreateRequestDto[];
  handleQuestionChange: (qIndex: number, field: string, value: any) => void;
  removeQuestion: (index: number) => void;
  handleAnswerChange: (qIndex: number, aIndex: number, field: string, vale: any) => void;
  removeAnswer: (qIndex: number, aIndex: number) => void;
  addAnswer: (index: number) => void;
}

export default function DraggableQuestionsList(props: DraggableQuestionsListProps) {
  const isSmallScreen = IsSmallScreen();
  return (
    <DragDropContext onDragEnd={props.onDragEnd}>
      <Droppable droppableId="droppableQuestions" type="questions">
        {(provided) => (
          <List ref={provided.innerRef} {...provided.droppableProps}>
            {props.questions.map((question, qIndex) => (
              <Draggable key={qIndex}
                         draggableId={`question-${qIndex}`}
                         index={qIndex}>
                {(provided) => (
                  <ListItem
                    ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                    sx={{paddingLeft: 0, paddingRight: 0}}>
                    <Card variant={"outlined"} sx={{width: "100%"}}>
                      <CardContent>
                        <Stack spacing={2}>
                          {isSmallScreen
                            ? <Stack spacing={2}>
                              <Stack spacing={2} direction={"row"} justifyContent={"space-between"}
                                     alignItems={"center"}>
                                <Typography variant={"h5"}>
                                  {question.order}.
                                </Typography>
                                <Button type="button"
                                        variant={"contained"}
                                        color={"error"}
                                        sx={{width: "fit-content"}}
                                        disabled={props.questions.length < 2}
                                        onClick={() => props.removeQuestion(qIndex)}>
                                  Delete
                                </Button>
                              </Stack>
                              <RichTextEditorControlled id={qIndex}
                                                        key={`rteditor-${qIndex}`}
                                                        value={question.text}
                                                        onChange={(currentValue: string) => props.handleQuestionChange(qIndex, "text", currentValue)}/>
                            </Stack>
                            : <Stack spacing={2} direction={"row"} alignItems={"center"}>
                              <Typography variant={"h5"}>
                                {question.order}.
                              </Typography>
                              <RichTextEditorControlled id={qIndex}
                                                        key={`rteditor-${qIndex}`}
                                                        value={question.text}
                                                        onChange={(currentValue: string) => props.handleQuestionChange(qIndex, "text", currentValue)}/>
                              <IconButton type="button"
                                          disabled={props.questions.length < 2}
                                          onClick={() => props.removeQuestion(qIndex)}>
                                <DeleteIcon disabled={props.questions.length < 2}/>
                              </IconButton>
                            </Stack>}
                          <Grid container spacing={2}>
                            <Grid item>
                              <Grid container spacing={2} alignItems={"center"}>
                                <Grid item>
                                  <Typography sx={{whiteSpace: "nowrap"}}>Question
                                    Type:</Typography>
                                </Grid>
                                <Grid item>
                                  <Select
                                    value={question.type}
                                    required
                                    onChange={(e) => props.handleQuestionChange(qIndex, "type", e.target.value)}
                                  >
                                    <MenuItem value={QuestionType.RADIO}>Radio
                                      Button</MenuItem>
                                    <MenuItem
                                      value={QuestionType.CHECKBOX}>Checkbox</MenuItem>
                                  </Select>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item>
                              <Grid container spacing={2} alignItems={"center"}>
                                <Grid item>
                                  <Typography sx={{whiteSpace: "nowrap"}}>Max
                                    Points:</Typography>
                                </Grid>
                                <Grid item>
                                  <TextField
                                    type="number"
                                    inputProps={{min: 1, max: 1000}}
                                    required
                                    value={question.points}
                                    onChange={(e) => props.handleQuestionChange(qIndex, "points", e.target.value)}
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant={"h6"}>Answers</Typography>
                            </Grid>
                          </Grid>
                          <DraggableQuestionAnswersList qIndex={qIndex}
                                                        question={question}
                                                        handleAnswerChange={props.handleAnswerChange}
                                                        removeAnswer={props.removeAnswer}/>
                          <Button startIcon={<AddIcon/>} type="button"
                                  onClick={() => props.addAnswer(qIndex)}>
                            Add New Answer
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </ListItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
}
