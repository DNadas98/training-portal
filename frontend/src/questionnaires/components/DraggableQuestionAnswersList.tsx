import {
  Button,
  Card,
  CardContent, Checkbox, IconButton,
  List,
  ListItem,
  Radio,
  Stack,
  TextField,
  Typography, useMediaQuery, useTheme
} from "@mui/material";
import {Draggable, Droppable} from "react-beautiful-dnd";
import {QuestionType} from "../dto/QuestionType.ts";
import {QuestionCreateRequestDto} from "../dto/QuestionCreateRequestDto.ts";
import DeleteIcon from "../../common/utils/components/DeleteIcon.tsx";

interface DraggableQuestionAnswersListProps {
  qIndex: number;
  question: QuestionCreateRequestDto;
  handleAnswerChange: (qIndex: number, aIndex: number, field: string, vale: any) => void;
  removeAnswer: (qIndex: number, aIndex: number) => void;
}

export default function DraggableQuestionAnswersList(props: DraggableQuestionAnswersListProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Droppable droppableId={`droppableAnswers-${props.qIndex}`}
               type={`answers-${props.qIndex}`}>
      {(provided) => (
        <List
          ref={provided.innerRef} {...provided.droppableProps}>
          {props.question.answers.map((answer, aIndex) => (
            <Draggable key={aIndex}
                       draggableId={`answer-${props.qIndex}-${aIndex}`}
                       index={aIndex}>
              {(provided) => (
                <ListItem
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}>
                  <Card raised sx={{width: "100%"}}>
                    <CardContent>
                      <Stack spacing={2}>
                        {isSmallScreen
                          ? <Stack spacing={2}>
                            <TextField
                              type="text"
                              label={"Answer Text"}
                              required
                              multiline
                              minRows={2}
                              inputProps={{
                                minLength: 1,
                                maxLength: 100
                              }}
                              value={answer.text}
                              onChange={(e) => props.handleAnswerChange(props.qIndex, aIndex, "text", e.target.value)}
                              fullWidth
                            />
                            <Button type="button"
                                    variant={"contained"}
                                    color={"error"}
                                    sx={{width: "fit-content"}}
                                    disabled={props.question.answers.length < 2}
                                    onClick={() => props.removeAnswer(props.qIndex, aIndex)}>
                              Delete
                            </Button>
                          </Stack>
                          : <Stack spacing={2} direction={"row"} alignItems={"center"}>
                            <Typography variant={"h6"}>
                              {answer.order}.
                            </Typography>
                            <TextField
                              type="text"
                              label={"Answer Text"}
                              required
                              multiline
                              minRows={1}
                              inputProps={{
                                minLength: 1,
                                maxLength: 100
                              }}
                              value={answer.text}
                              onChange={(e) => props.handleAnswerChange(props.qIndex, aIndex, "text", e.target.value)}
                              fullWidth
                            />
                            <IconButton type="button"
                                        disabled={props.question.answers.length < 2}
                                        onClick={() => props.removeAnswer(props.qIndex, aIndex)}>
                              <DeleteIcon disabled={props.question.answers.length < 2}/>
                            </IconButton>
                          </Stack>}
                        <Stack spacing={2} direction={"row"} alignItems={"center"}>
                          <Typography>Correct Answer:</Typography>
                          {props.question.type === QuestionType.RADIO ? (
                            <Radio
                              checked={answer.correct}
                              onChange={(e) => props.handleAnswerChange(props.qIndex, aIndex, "correct", e.target.checked)}
                            />
                          ) : (
                            <Checkbox
                              checked={answer.correct}
                              onChange={(e) => props.handleAnswerChange(props.qIndex, aIndex, "correct", e.target.checked)}
                            />
                          )}
                        </Stack>
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
  );
}
