import {GroupResponsePublicDto} from "../../../../groups/dto/GroupResponsePublicDto.ts";
import {ProjectResponsePublicDto} from "../../../../projects/dto/ProjectResponsePublicDto.ts";
import {QuestionnaireResponseEditorDto} from "../../../../questionnaires/dto/QuestionnaireResponseEditorDto.ts";
import {Autocomplete, Avatar, Button, Card, CardActions, CardContent, CardHeader, Grid, TextField} from "@mui/material";
import {PersonAddOutlined} from "@mui/icons-material";
import {ChangeEvent} from "react";

interface UserPreRegistrationFormProps {
  groups: GroupResponsePublicDto[],
  groupsLoading: boolean,
  selectedGroup: GroupResponsePublicDto | undefined | null,
  onGroupSelect: (_event: ChangeEvent<NonNullable<unknown>>, newValue: GroupResponsePublicDto | null) => void,
  onGroupSearchInputChange: (e: any) => void,
  projects: ProjectResponsePublicDto[],
  projectsLoading: boolean,
  selectedProject: ProjectResponsePublicDto | undefined | null,
  onProjectSelect: (_event: ChangeEvent<NonNullable<unknown>>, newValue: ProjectResponsePublicDto | null) => void,
  onProjectSearchInputChange: (_event: ChangeEvent<NonNullable<unknown>>, newValue: ProjectResponsePublicDto | null) => void,
  questionnaires: QuestionnaireResponseEditorDto[],
  questionnairesLoading: boolean,
  selectedQuestionnaire: QuestionnaireResponseEditorDto | undefined | null,
  onQuestionnaireSelect: (_event: ChangeEvent<NonNullable<unknown>>, newValue: QuestionnaireResponseEditorDto | null) => void,
  onQuestionnaireSearchInputChange: (e: any) => void,
  selectedFile: File | undefined | null,
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void,
  onSubmit: (e: any) => void,
  onBackClick: () => void
}

export default function UserPreRegistrationForm(props: UserPreRegistrationFormProps) {
  return (
    <Grid container justifyContent={"center"} alignItems={"center"} spacing={2}>
      <Grid item xs={10}>
        <Card component={"form"} onSubmit={props.onSubmit}>
          <CardHeader
            title={"User Pre-Registration"}
            titleTypographyProps={{variant: "h5"}}
            avatar={
              <Avatar variant={"rounded"} color={"primary.main"}>
                <PersonAddOutlined/>
              </Avatar>}/>
          <CardContent><Grid container spacing={2}>
            <Grid item xs={12}>
              <Autocomplete
                options={props.groups}
                getOptionLabel={(option: GroupResponsePublicDto) => option.name}
                loading={props.groupsLoading}
                value={props.selectedGroup}
                onChange={props.onGroupSelect}
                renderInput={(params) => (
                  <TextField {...params} label="Select Group" variant="outlined"/>)}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={props.projects}
                getOptionLabel={(option: ProjectResponsePublicDto) => option.name}
                loading={props.projectsLoading}
                value={props.selectedProject}
                onChange={props.onProjectSelect}
                renderInput={(params) => (
                  <TextField {...params} label="Select Project" variant="outlined"/>)}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={props.questionnaires}
                getOptionLabel={(option: QuestionnaireResponseEditorDto) => option.name}
                loading={props.questionnairesLoading}
                value={props.selectedQuestionnaire}
                onChange={props.onQuestionnaireSelect}
                renderInput={(params) => (
                  <TextField {...params} label="Select Questionnaire" variant="outlined"/>)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Upload User Data - .csv, max. 400KB"
                type="file"
                required
                InputLabelProps={{shrink: true}}
                InputProps={{
                  inputProps: {
                    accept: "text/csv",
                    onChange: props.onFileSelect
                  }
                }}
                variant="filled"
                fullWidth
                name="userData"
              />
            </Grid>
          </Grid></CardContent>
          <CardActions>
            <Button type={"submit"}>Send</Button>
            <Button type={"button"} onClick={props.onBackClick}>
              Back
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}
