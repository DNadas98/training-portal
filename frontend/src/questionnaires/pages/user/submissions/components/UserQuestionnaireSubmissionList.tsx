import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import {QuestionnaireSubmissionResponseDto} from "../../../../dto/QuestionnaireSubmissionResponseDto.ts";
import QuestionnaireSubmissionCard from "./QuestionnaireSubmissionCard.tsx";

interface UserQuestionnaireSubmissionListProps {
  maxPoints: boolean,
  questionnaireSubmissions: QuestionnaireSubmissionResponseDto[],

  onDeleteClick(id): void,

  onSelectClick: (id: number) => Promise<void>,
  selectedQuestionnaireSubmissionLoading: boolean
}

export default function UserQuestionnaireSubmissionList(props: UserQuestionnaireSubmissionListProps) {
  return(<>
    {props.questionnaireSubmissions?.length > 0
      ? props.questionnaireSubmissions.map((submission) => {
        return <Card key={submission.id}>
          <QuestionnaireSubmissionCard submission={submission}/>
          <CardActions>
            <Button onClick={() => {
              props.onSelectClick(submission.id)
            }}
                    disabled={props.selectedQuestionnaireSubmissionLoading}>
              View Details
            </Button>
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
              {"You haven't achieved maximum points on this questionnaire yet."}
            </Typography>
            : <Typography>
              {"You haven't submitted this questionnaire yet."}
            </Typography>
          }
        </CardContent>
      </Card>}
  </>);
}
