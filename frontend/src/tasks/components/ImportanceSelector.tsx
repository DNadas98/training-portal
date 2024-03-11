import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {Importance} from "../dto/Importance.ts";

interface ImportanceSelectorProps {
  defaultValue?: Importance;
  importances: Importance[];
}

export default function ImportanceSelector(props: ImportanceSelectorProps) {
  return (
    <FormControl fullWidth>
      <InputLabel id={"importance-select-label"}>Importance</InputLabel>
      <Select
        labelId={"importance-select-label"}
        label="Importance"
        name={"importance"}
        required
        defaultValue={props.defaultValue ?? props.importances[0]}
      >
        {props.importances.map(importance => {
          return <MenuItem key={importance}
                           value={importance}>
            {importance}
          </MenuItem>
        })}
      </Select>
    </FormControl>
  )
}
