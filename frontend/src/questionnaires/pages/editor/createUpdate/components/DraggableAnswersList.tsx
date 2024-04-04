import {Button, List, ListItem,} from "@mui/material";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {QuestionType} from "../../../../dto/QuestionType.ts";
import AnswerItem from "./AnswerItem.tsx";
import {v4 as uuidv4} from 'uuid';
import {reorder} from "../../../../../common/utils/reorder.ts";
import {AnswerRequestDto} from "../../../../dto/AnswerRequestDto.ts";
import AddIcon from "../../../../../common/utils/components/AddIcon.tsx";
import {useCallback} from "react";

interface DraggableAnswersListProps {
  questionType: QuestionType,
  answersLength: number,
  questionTempId: uuidv4,
  answers: AnswerRequestDto[];

  onUpdateAnswers(updatedAnswers: AnswerRequestDto[]): void;
}

const DraggableAnswersList = (props: DraggableAnswersListProps) => {


  const handleOnDragEnd = useCallback((result) => {
    if (!result.destination) {
      return;
    }
    const reorderedAnswers = reorder<AnswerRequestDto>(props.answers, result.source.index, result.destination.index);
    props.onUpdateAnswers(reorderedAnswers);
  }, [props.answers, props.onUpdateAnswers]);

  const handleAddAnswer = useCallback(() => {
    props.onUpdateAnswers([...props.answers, {
      tempId: uuidv4(),
      text: '',
      correct: false,
      order: props.answers.length + 1
    }]);
  }, [props.answers, props.onUpdateAnswers]);

  const handleRemoveAnswer = useCallback((tempId) => {
    if (props.answers.length > 1) {
      const updatedAnswers = props.answers.filter(answer => answer.tempId !== tempId);
      props.onUpdateAnswers(updatedAnswers);
    }
  }, [props.answers, props.onUpdateAnswers]);

  const handleUpdateAnswer = useCallback((tempId, updatedProps) => {
    let updatedAnswers;
    if (updatedProps.correct && props.questionType === QuestionType.RADIO) {
      updatedAnswers = props.answers.map(answer =>
        answer.tempId === tempId ? {...answer, ...updatedProps} : {...answer, correct: false}
      );
    } else {
      updatedAnswers = props.answers.map(answer =>
        answer.tempId === tempId ? {...answer, ...updatedProps} : answer
      );
    }
    props.onUpdateAnswers(updatedAnswers);
  }, [props.answers, props.onUpdateAnswers, props.questionType]);

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId={`droppableAnswers-${props.questionTempId}`}
                   type={`answers-${props.questionTempId}`}>
          {(provided) => (
            <List
              ref={provided.innerRef} {...provided.droppableProps}>
              {props.answers.map((answer, aIndex) => (
                <Draggable key={answer.tempId}
                           draggableId={`answer-${props.questionTempId}-${answer.tempId}`}
                           index={aIndex}>
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      <AnswerItem key={answer.tempId}
                                  questionType={props.questionType} questionTempId={props.questionTempId}
                                  answersLength={props.answers.length} answer={answer}
                                  onAnswerUpdate={handleUpdateAnswer} onRemoveAnswer={handleRemoveAnswer}/>
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
      <Button startIcon={<AddIcon/>} type="button"
              onClick={handleAddAnswer}>
        Add New Answer
      </Button>
    </>
  );
}

export default DraggableAnswersList;
