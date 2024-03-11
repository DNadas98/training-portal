import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {TaskStatus} from "../dto/TaskStatus.ts";

interface TaskStatusSelectorProps {
  statuses: TaskStatus[],
  defaultValue?: TaskStatus
}

export default function TaskStatusSelector(props: TaskStatusSelectorProps) {
  return (
    <FormControl fullWidth>
      <InputLabel id={"taskStatus-select-label"}>Task Status</InputLabel>
      <Select
        labelId={"taskStatus-select-label"}
        label="Task Status"
        name={"taskStatus"}
        required
        defaultValue={props.defaultValue ?? props.statuses[0]}
      >
        {props.statuses.map(taskStatus => {
          return <MenuItem key={taskStatus}
                           value={taskStatus}>
            {taskStatus}
          </MenuItem>
        })}
      </Select>
    </FormControl>
  )
}
