import LoadingSpinner from "../../../../common/utils/components/LoadingSpinner.tsx";
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  Typography
} from "@mui/material";
import ExpandIcon from "../../../../common/utils/components/ExpandIcon.tsx";
import {TaskResponseDto} from "../../../dto/TaskResponseDto.ts";

interface TaskListProps {
  loading: boolean,
  tasks: TaskResponseDto[],
  notFoundText: string,
  onActionButtonClick: (taskId: number) => unknown;
  actionButtonDisabled: boolean;
  userIsMember: boolean;
}

export default function TaskList(props: TaskListProps) {

  return props.loading
    ? <LoadingSpinner/>
    : props.tasks?.length > 0
      ? props.tasks.map((task, index) => {
        return <Card key={task.taskId}>
          <Accordion defaultExpanded={index === 0}
                     variant={"elevation"}
                     sx={{paddingTop: 0.5, paddingBottom: 0.5}}>
            <AccordionSummary expandIcon={<ExpandIcon/>}>
              <Typography variant={"h6"} sx={{
                wordBreak: "break-word",
                paddingRight: 1
              }}>
                {task.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant={"body2"}>
                {task.description}
              </Typography>
            </AccordionDetails>
            <AccordionActions>
              <Button sx={{textTransform: "none"}}
                      disabled={props.actionButtonDisabled}
                      onClick={() => {
                        props.onActionButtonClick(task.taskId);
                      }}>
                {props.userIsMember ? "View Dashboard" : "Join task"}
              </Button>
            </AccordionActions>
          </Accordion>
        </Card>
      })
      : <Card>
        <CardContent>
          <Typography>
            {props.notFoundText}
          </Typography>
        </CardContent>
      </Card>


}
