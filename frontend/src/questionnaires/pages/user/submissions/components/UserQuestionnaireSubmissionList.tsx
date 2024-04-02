import {Card, CardContent, Typography} from "@mui/material";
import {QuestionnaireSubmissionResponseDto} from "../../../../dto/QuestionnaireSubmissionResponseDto.ts";
import UserQuestionnaireSubmissionCard from "./UserQuestionnaireSubmissionCard.tsx";

interface UserQuestionnaireSubmissionListProps {
  maxPoints: boolean,
  questionnaireSubmissions: QuestionnaireSubmissionResponseDto[]
}

export default function UserQuestionnaireSubmissionList(props: UserQuestionnaireSubmissionListProps) {
  return props.questionnaireSubmissions?.length > 0
    ? props.questionnaireSubmissions.map((submission) => {
      return <Card key={submission.id}><UserQuestionnaireSubmissionCard submission={submission}/></Card>;
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
