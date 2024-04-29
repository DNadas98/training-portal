import {Button, Card, CardActions, CardContent, Typography} from "@mui/material";
import {QuestionnaireSubmissionResponseDto} from "../../../../dto/QuestionnaireSubmissionResponseDto.ts";
import QuestionnaireSubmissionCard from "./QuestionnaireSubmissionCard.tsx";
import useLocalized from "../../../../../common/localization/hooks/useLocalized.tsx";


interface UserQuestionnaireSubmissionListProps {
  maxPoints: boolean,
  questionnaireSubmissions: QuestionnaireSubmissionResponseDto[],

  onDeleteClick(id): void,

  onSelectClick: (id: number) => Promise<void>,
  selectedQuestionnaireSubmissionLoading: boolean
}

export default function UserQuestionnaireSubmissionList(props: UserQuestionnaireSubmissionListProps) {
  const localized = useLocalized();
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
              {localized("questionnaire.view_details")}
            </Button>
            <Button onClick={() => {
              props.onDeleteClick(submission.id)
            }}
                    color={"error"}>
              {localized("inputs.delete")}
            </Button>
          </CardActions>
        </Card>;
      })
      : <Card>
        <CardContent>
          {props.maxPoints
            ? <Typography>
              {localized("not_max_points")}
            </Typography>
            : <Typography>
              {localized("not_send_questionnaire")}
            </Typography>
          }
        </CardContent>
      </Card>}
  </>);
}
