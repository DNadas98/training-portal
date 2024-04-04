import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {Button, Card, CardContent, List, ListItem,} from "@mui/material";
import {QuestionRequestDto} from "../../../../dto/QuestionRequestDto.ts";
import QuestionItem from "./QuestionItem.tsx";
import {reorder} from "../../../../../common/utils/reorder.ts";
import {v4 as uuidv4} from 'uuid';
import {QuestionType} from "../../../../dto/QuestionType.ts";
import AddIcon from "../../../../../common/utils/components/AddIcon.tsx";

interface DraggableQuestionsListProps {
  questionsLength: number;
  questions: QuestionRequestDto[];
  onUpdateQuestions: (updatedQuestion: QuestionRequestDto[]) => void;
}

export default function DraggableQuestionsList(props: DraggableQuestionsListProps) {
  const handleOnDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const reorderedQuestions = reorder<QuestionRequestDto>(props.questions,
      result.source.index, result.destination.index);
    props.onUpdateQuestions(reorderedQuestions);
  };

  const handleAddQuestion = () => {
    props.onUpdateQuestions([...props.questions, {
      tempId: uuidv4(),
      text: '',
      type: QuestionType.RADIO,
      points: 1,
      order: props.questions.length + 1,
      answers: [{
        tempId: uuidv4(),
        text: '',
        correct: false,
        order: 1
      }]
    }]);
  }

  const handleRemoveQuestion = (tempId: uuidv4) => {
    if (props.questions.length > 1) {
      const updatedQuestions = props.questions.filter(question => {
        return question.tempId !== tempId
      });
      props.onUpdateQuestions(updatedQuestions);
    }
  };

  const handleUpdateQuestion = (tempId: uuidv4, updatedProps: Partial<QuestionRequestDto>) => {
    const updatedQuestions = props.questions.map(question => {
      if (question.tempId === tempId) {
        return {...question, ...updatedProps};
      }
      return question;
    });
    props.onUpdateQuestions(updatedQuestions);
  }

  return (<>
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="droppableQuestions" type="questions">
        {(provided) => (
          <List ref={provided.innerRef} {...provided.droppableProps}>
            {props.questions.map((question, qIndex) => (
              <Draggable key={question.tempId}
                         draggableId={`question-${question.tempId}`}
                         index={qIndex}>
                {(provided) => (
                  <ListItem
                    ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                    sx={{paddingLeft: 0, paddingRight: 0}}>
                    <QuestionItem question={question} questionsLength={props.questions.length}
                                  onQuestionUpdate={handleUpdateQuestion}
                                  onRemoveQuestion={handleRemoveQuestion}/>
                  </ListItem>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
    <Card variant={"outlined"} sx={{width: "100%"}}>
      <CardContent>
        <Button startIcon={<AddIcon/>} onClick={handleAddQuestion} fullWidth>
          Add New Question
        </Button>
      </CardContent>
    </Card>
  </>);
}
