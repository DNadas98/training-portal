import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

interface DifficultySelectorProps {
  minDifficulty: number;
  maxDifficulty: number;
  defaultValue?: number;
}

export default function DifficultySelector(props: DifficultySelectorProps) {
  const difficulties: number[] = [];
  for (let i: number = props.minDifficulty; i <= props.maxDifficulty; i++) {
    difficulties.push(i);
  }
  return (
    <FormControl fullWidth>
      <InputLabel id={"difficulty-select-label"}>Difficulty</InputLabel>
      <Select
        labelId={"difficulty-select-label"}
        label="Difficulty"
        name={"difficulty"}
        required
        defaultValue={props.defaultValue ?? difficulties[0]}
      >
        {difficulties.map(difficultyLevel => {
          return <MenuItem key={difficultyLevel.toString()}
                           value={difficultyLevel}>
            {difficultyLevel}
          </MenuItem>
        })}
      </Select>
    </FormControl>
  )
}
