import React from "react";
import {Avatar, Button, Card, CardContent, Grid, Stack, Typography} from "@mui/material";
import {DomainOutlined} from "@mui/icons-material";
import TaskNameInput from "../../../components/TaskNameInput.tsx";
import TaskDescriptionInput from "../../../components/TaskDescriptionInput.tsx";
import StartDateInput from "../../../../common/utils/components/StartDateInput.tsx";
import DeadlineInput from "../../../../common/utils/components/DeadlineInput.tsx";
import {Importance} from "../../../dto/Importance.ts";
import {TaskStatus} from "../../../dto/TaskStatus.ts";
import DifficultySelector from "../../../components/DifficultySelector.tsx";
import ImportanceSelector from "../../../components/ImportanceSelector.tsx";
import TaskStatusSelector from "../../../components/TaskStatusSelector.tsx";

interface UpdateTaskFormProps {
  name: string,
  description: string,
  startDate: Date,
  deadline: Date,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
  difficulty: number,
  taskImportance: Importance,
  taskStatus: TaskStatus,
  statuses: TaskStatus[],
  importances: Importance[],
  minDifficulty: number,
  maxDifficulty: number
}

export default function UpdateTaskForm(props: UpdateTaskFormProps) {
  return (
    <Grid container justifyContent={"center"}>
      <Grid item xs={10} sm={8} md={7} lg={6}>
        <Card sx={{
          paddingTop: 4, textAlign: "center",
          maxWidth: 800, width: "100%",
          marginLeft: "auto", marginRight: "auto"
        }}>
          <Stack
            spacing={2}
            alignItems={"center"}
            justifyContent={"center"}>
            <Avatar variant={"rounded"}
                    sx={{backgroundColor: "secondary.main"}}>
              <DomainOutlined/>
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Update task details
            </Typography>
          </Stack>
          <CardContent sx={{justifyContent: "center", textAlign: "center"}}>
            <Grid container sx={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              gap: "2rem"
            }}>
              <Grid item xs={10} sm={9} md={7} lg={6}
                    sx={{borderColor: "secondary.main"}}>
                <form onSubmit={props.onSubmit}>
                  <Stack spacing={2}>
                    <TaskNameInput name={props.name}/>
                    <TaskDescriptionInput description={props.description}/>
                    <StartDateInput defaultValue={props.startDate}/>
                    <DeadlineInput defaultValue={props.deadline}/>
                    <DifficultySelector defaultValue={props.difficulty} minDifficulty={props.minDifficulty}
                                        maxDifficulty={props.maxDifficulty}/>
                    <ImportanceSelector defaultValue={props.taskImportance} importances={props.importances}/>
                    <TaskStatusSelector defaultValue={props.taskStatus} statuses={props.statuses}/>
                    <Button type={"submit"}
                            variant={"contained"}>
                      Update Task
                    </Button>
                  </Stack>
                </form>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}
