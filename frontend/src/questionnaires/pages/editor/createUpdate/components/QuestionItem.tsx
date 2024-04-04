import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import RichTextEditorControlled from "../../../../../common/richTextEditor/RichTextEditorControlled.tsx";
import DeleteIcon from "../../../../../common/utils/components/DeleteIcon.tsx";
import {QuestionType} from "../../../../dto/QuestionType.ts";
import DraggableAnswersList from "./DraggableAnswersList.tsx";
import IsSmallScreen from "../../../../../common/utils/IsSmallScreen.tsx";
import {memo, useCallback, useState} from "react";
import {QuestionRequestDto} from "../../../../dto/QuestionRequestDto.ts";
import {AnswerRequestDto} from "../../../../dto/AnswerRequestDto.ts";
import {v4 as uuidv4} from "uuid";

interface QuestionItemProps {
  question: QuestionRequestDto;
  questionsLength: number;
  onQuestionUpdate: (tempId: uuidv4, updatedData: Partial<QuestionRequestDto>) => void;
  onRemoveQuestion: (tempId: uuidv4) => void;
}

const QuestionItem = memo((props: QuestionItemProps) => {
  const isSmallScreen = IsSmallScreen();
  const [text, setText] = useState<string>(props.question?.text ?? "");
  const [type, setType] = useState(props.question?.type ?? QuestionType.RADIO);
  const [points, setPoints] = useState<number>(props.question.points ?? 1);
  const [answers, setAnswers] = useState<AnswerRequestDto[]>(props.question.answers);

  const handleTextChange = useCallback((changedText: string) => {
    setText(changedText);
    props.onQuestionUpdate(props.question.tempId, {text: changedText});
  }, [props.question.tempId, props.onQuestionUpdate]);


  const handleTypeChange = useCallback((event) => {
    const changedType = event.target.value;
    setType(changedType);
    if (changedType === !QuestionType.RADIO) {
      props.onQuestionUpdate(props.question.tempId, {type: changedType});
    } else {
      let foundFirstCorrect = false;
      const updatedAnswers = answers.map(answer => {
        if (answer.correct && !foundFirstCorrect) {
          foundFirstCorrect = true;
          return answer;
        }
        return {...answer, correct: !foundFirstCorrect ? answer.correct : false};
      });
      setAnswers(updatedAnswers);
      props.onQuestionUpdate(props.question.tempId, {type: changedType, answers: updatedAnswers});
    }
  }, [props.question.tempId, props.onQuestionUpdate, answers]);

  const handlePointsChange = useCallback((event) => {
    const changedPoints = event.target.value;
    setPoints(changedPoints);
    props.onQuestionUpdate(props.question.tempId, {points: changedPoints});
  }, [props.question.tempId, props.onQuestionUpdate]);

  const handleUpdateAnswers = useCallback((updatedAnswers: AnswerRequestDto[]) => {
    setAnswers(updatedAnswers);
    props.onQuestionUpdate(props.question.tempId, {answers: updatedAnswers});
  }, [props.question.tempId, props.onQuestionUpdate]);

  const handleRemoveQuestion = useCallback(() => {
    props.onRemoveQuestion(props.question.tempId);
  }, [props.question.tempId, props.onRemoveQuestion]);

  return (
    <Card variant={"outlined"} sx={{minWidth: "100%"}}>
      <CardContent>
        <Stack spacing={2}>
          {isSmallScreen
            ?
            <Stack spacing={2}>
              <Stack spacing={2} direction={"row"} justifyContent={"space-between"}
                     alignItems={"center"}>
                <Typography variant={"h5"}>
                  {props.question.order}.
                </Typography>
                <Button type="button"
                        variant={"contained"}
                        color={"error"}
                        sx={{width: "fit-content"}}
                        disabled={props.questionsLength < 2}
                        onClick={handleRemoveQuestion}>
                  Delete
                </Button>
              </Stack>
              <RichTextEditorControlled id={props.question.tempId}
                                        key={`rteditor-${props.question.tempId}`}
                                        value={text}
                                        onChange={handleTextChange}/>
            </Stack>
            : <Stack spacing={2} direction={"row"} alignItems={"center"}>
              <Typography variant={"h5"}>
                {props.question.order}.
              </Typography>
              <RichTextEditorControlled id={props.question.tempId}
                                        key={`rteditor-${props.question.tempId}`}
                                        value={props.question.text}
                                        onChange={handleTextChange}/>
              <IconButton type="button"
                          disabled={props.questionsLength < 2}
                          onClick={handleRemoveQuestion}>
                <DeleteIcon disabled={props.questionsLength < 2}/>
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
                    value={type}
                    required
                    onChange={handleTypeChange}
                  >
                    <MenuItem value={QuestionType.RADIO}>
                      Radio Button
                    </MenuItem>
                    <MenuItem
                      value={QuestionType.CHECKBOX}>Checkbox</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container spacing={2} alignItems={"center"}>
                <Grid item>
                  <Typography sx={{whiteSpace: "nowrap"}}>
                    Max Points:
                  </Typography>
                </Grid>
                <Grid item>
                  <TextField
                    type="number"
                    inputProps={{min: 1, max: 1000}}
                    required
                    value={points}
                    onChange={handlePointsChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"h6"}>Answers</Typography>
          </Grid>
          {answers.length
            ? <DraggableAnswersList key={`answersList-${props.question.tempId}`}
                                    questionType={type} answersLength={answers.length}
                                    questionTempId={props.question.tempId}
                                    answers={answers} onUpdateAnswers={handleUpdateAnswers}/>
            : <></>}
        </Stack>
      </CardContent>
    </Card>
  );
});

export default QuestionItem;
