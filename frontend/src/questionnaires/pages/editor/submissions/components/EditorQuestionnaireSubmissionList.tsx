import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import UserQuestionnaireSubmissionCard from "../../../user/submissions/components/UserQuestionnaireSubmissionCard.tsx";
import {QuestionnaireSubmissionResponseEditorDto} from "../../../../dto/QuestionnaireSubmissionResponseEditorDto.ts";

interface EditorQuestionnaireSubmissionListProps {
  maxPoints: boolean,
  questionnaireSubmissions: QuestionnaireSubmissionResponseEditorDto[],
  onDeleteClick: (submissionId: number) => void;
}

export default function EditorQuestionnaireSubmissionList(props: EditorQuestionnaireSubmissionListProps) {
  return props.questionnaireSubmissions?.length > 0
    ? props.questionnaireSubmissions.map((submission) => {
      return <Card key={submission.id}>
        <UserQuestionnaireSubmissionCard submission={submission}/>
        <CardActions>
          <Button onClick={()=>{props.onDeleteClick(submission.id)}}
           color={"error"}>
            Delete
          </Button>
        </CardActions>
      </Card>;
    })
    : <Card>
      <CardContent>
        {props.maxPoints
          ? <Typography>
            {"You haven't submitted a questionnaire with maximum points for this project yet."}
          </Typography>
          : <Typography>
          </Typography>
        }

      </CardContent>
    </Card>;


}
