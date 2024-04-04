import {
  Button,
  Card,
  CardContent,
  Checkbox,
  debounce,
  IconButton,
  Radio,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import DeleteIcon from "../../../../../common/utils/components/DeleteIcon.tsx";
import {QuestionType} from "../../../../dto/QuestionType.ts";
import IsSmallScreen from "../../../../../common/utils/IsSmallScreen.tsx";
import {v4 as uuidv4} from 'uuid';
import {AnswerRequestDto} from "../../../../dto/AnswerRequestDto.ts";
import {memo, useCallback, useState} from "react";

interface AnswerItemProps {
  questionType: QuestionType,
  answersLength: number,
  questionTempId: uuidv4,
  answer: AnswerRequestDto,
  onAnswerUpdate: (tempId: uuidv4, updatedData: Partial<AnswerRequestDto>) => void;
  onRemoveAnswer: (answerTempId: uuidv4) => void;
}

const AnswerItem = memo((props: AnswerItemProps) => {
  const isSmallScreen = IsSmallScreen();
  const [text, setText] = useState<string>(props.answer?.text ?? "");

  const handleTextChange = useCallback(debounce((changedText) => {
    props.onAnswerUpdate(props.answer.tempId, {text: changedText});
  }, 600), [props.onAnswerUpdate, props.answer.tempId]);

  const onTextChange = useCallback((event) => {
    const newText = event.target.value;
    setText(newText);
    handleTextChange(newText);
  }, [handleTextChange]);

  const handleCorrectnessChange = useCallback((event) => {
    const changedCorrectness = event.target.checked;
    props.onAnswerUpdate(props.answer.tempId, {correct: changedCorrectness});
  }, [props.onAnswerUpdate, props.answer.tempId]);

  const handleRemoveAnswer = useCallback(() => {
    props.onRemoveAnswer(props.answer.tempId);
  }, [props.onRemoveAnswer, props.answer.tempId]);

  return (
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
                value={text}
                onChange={onTextChange}
                fullWidth
              />
              <Button type="button"
                      variant={"contained"}
                      color={"error"}
                      sx={{width: "fit-content"}}
                      disabled={props.answersLength < 2}
                      onClick={handleRemoveAnswer}>
                Delete
              </Button>
            </Stack>
            : <Stack spacing={2} direction={"row"} alignItems={"center"}>
              <Typography variant={"h6"}>
                {String.fromCharCode(props.answer.order + 64)}:
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
                value={text}
                onChange={onTextChange}
                fullWidth
              />
              <IconButton type="button"
                          disabled={props.answersLength < 2}
                          onClick={handleRemoveAnswer}>
                <DeleteIcon disabled={props.answersLength < 2}/>
              </IconButton>
            </Stack>}
          <Stack spacing={2} direction={"row"} alignItems={"center"}>
            <Typography>Correct Answer:</Typography>
            {props.questionType === QuestionType.RADIO ? (
              <Radio
                key={`radio-${props.answer.tempId}`}
                checked={props.answer.correct}
                onChange={handleCorrectnessChange}
              />
            ) : (
              <Checkbox
                key={`checkbox-${props.answer.tempId}`}
                checked={props.answer.correct}
                onChange={handleCorrectnessChange}
              />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
});
export default AnswerItem;
