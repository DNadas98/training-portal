import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import {QuestionnaireSubmissionResponseDto} from "../../../../dto/QuestionnaireSubmissionResponseDto.ts";
import UserQuestionnaireSubmissionCard from "./UserQuestionnaireSubmissionCard.tsx";

interface UserQuestionnaireSubmissionListProps {
  maxPoints: boolean,
  questionnaireSubmissions: QuestionnaireSubmissionResponseDto[]

  onDeleteClick(id): void;
}

export default function UserQuestionnaireSubmissionList(props: UserQuestionnaireSubmissionListProps) {
  return props.questionnaireSubmissions?.length > 0
    ? props.questionnaireSubmissions.map((submission) => {
      return <Card key={submission.id}>
        <UserQuestionnaireSubmissionCard submission={submission}/>
        <CardActions>
          <Button onClick={() => {
            props.onDeleteClick(submission.id)
          }}
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
