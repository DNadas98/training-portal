import React from "react";
import {Avatar, Button, Card, CardContent, Grid, Stack, Typography} from "@mui/material";
import {DomainAddOutlined} from "@mui/icons-material";
import TaskNameInput from "../../../components/TaskNameInput.tsx";
import TaskDescriptionInput from "../../../components/TaskDescriptionInput.tsx";
import StartDateInput from "../../../../common/utils/components/StartDateInput.tsx";
import DeadlineInput from "../../../../common/utils/components/DeadlineInput.tsx";
import ImportanceSelector from "../../../components/ImportanceSelector.tsx";
import {Importance} from "../../../dto/Importance.ts";
import TaskStatusSelector from "../../../components/TaskStatusSelector.tsx";
import {TaskStatus} from "../../../dto/TaskStatus.ts";
import DifficultySelector from "../../../components/DifficultySelector.tsx";

interface AddCompanyFormProps {
  minDifficulty: number;
  maxDifficulty: number;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>,
  importances: Importance[];
  statuses: TaskStatus[];
}

export default function AddTaskForm(props: AddCompanyFormProps) {
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
              <DomainAddOutlined/>
            </Avatar>
            <Typography variant="h5" gutterBottom>
              Add new task
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
                    <TaskNameInput/>
                    <TaskDescriptionInput/>
                    <StartDateInput/>
                    <DeadlineInput/>
                    <DifficultySelector minDifficulty={props.minDifficulty} maxDifficulty={props.maxDifficulty}/>
                    <ImportanceSelector importances={props.importances}/>
                    <TaskStatusSelector statuses={props.statuses}/>
                    <Button type={"submit"}
                            variant={"contained"}>
                      Add Task
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
