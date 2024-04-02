import {TaskResponseDto} from "../../../dto/TaskResponseDto.ts";
import {Card, CardContent, CardHeader, Grid, IconButton, Stack, TextField} from "@mui/material";
import TaskList from "./TaskList.tsx";
import {FormEvent} from "react";
import AddIcon from "../../../../common/utils/components/AddIcon.tsx";

interface TaskBrowserProps {
  tasksWithUserLoading: boolean,
  tasksWithUser: TaskResponseDto[],
  tasksWithoutUserLoading: boolean,
  tasksWithoutUser: TaskResponseDto[],
  handleTasksWithUserSearch: (event: FormEvent<HTMLInputElement>) => void,
  handleTasksWithoutUserSearch: (event: FormEvent<HTMLInputElement>) => void,
  handleViewDashboardClick: (taskId: number) => unknown,
  handleJoinRequestClick: (taskId: number) => Promise<void>
  actionButtonDisabled: boolean;
  handleAddButtonClick: () => void;
}

export default function TaskBrowser(props: TaskBrowserProps) {
  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={10} sm={8} md={5} lg={4}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={"Your tasks"} sx={{textAlign: "center"}}/>
            <CardContent>
              <Stack direction={"row"} spacing={1} alignItems={"baseline"}>
                <IconButton onClick={props.handleAddButtonClick}>
                  <AddIcon/>
                </IconButton>
                <TextField variant={"standard"} type={"search"}
                           label={"Search"}
                           fullWidth
                           onInput={props.handleTasksWithUserSearch}
                />
              </Stack>
            </CardContent>
          </Card>
          <TaskList loading={props.tasksWithUserLoading}
                    tasks={props.tasksWithUser}
                    notFoundText={"We haven't found any tasks."}
                    onActionButtonClick={props.handleViewDashboardClick}
                    userIsMember={true}
                    actionButtonDisabled={false}/>
        </Stack>
      </Grid>
      <Grid item xs={10} sm={8} md={5} lg={4}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={"Tasks to join"} sx={{textAlign: "center"}}/>
            <CardContent>
              <TextField variant={"standard"} type={"search"} fullWidth
                         sx={{marginBottom: 1}}
                         label={"Search"}
                         onInput={props.handleTasksWithoutUserSearch}
              />
            </CardContent>
          </Card>
          <TaskList loading={props.tasksWithoutUserLoading}
                    tasks={props.tasksWithoutUser}
                    notFoundText={"We haven't found any tasks to join."}
                    onActionButtonClick={props.handleJoinRequestClick}
                    userIsMember={false}
                    actionButtonDisabled={props.actionButtonDisabled}/>
        </Stack>
      </Grid>
    </Grid>
  )
}
