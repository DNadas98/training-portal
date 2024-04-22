import {GroupResponsePublicDto} from "../../../../groups/dto/GroupResponsePublicDto.ts";
import {ProjectResponsePublicDto} from "../../../../projects/dto/ProjectResponsePublicDto.ts";
import {QuestionnaireResponseEditorDto} from "../../../../questionnaires/dto/QuestionnaireResponseEditorDto.ts";
import {
  Autocomplete,
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Stack,
  TextField, useTheme
} from "@mui/material";
import {FileDownload, PersonAddOutlined} from "@mui/icons-material";
import {ChangeEvent} from "react";
import {MobileDateTimePicker} from "@mui/x-date-pickers";

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
  onBackClick: () => void,
  onDownloadTemplate: () => void,
  onExpiresAtChange: (e: any) => void;
  expiresAt: any;
}

export default function UserPreRegistrationForm(props: UserPreRegistrationFormProps) {
  const theme = useTheme();
  return (
    <Grid container justifyContent={"center"} alignItems={"center"} spacing={2}>
      <Grid item xs={10} sm={8} md={5} lg={4}>
        <Card component={"form"} onSubmit={props.onSubmit}>
          <CardHeader
            title={"User Pre-Registration"}
            titleTypographyProps={{variant: "h5"}}
            avatar={
              <Avatar variant={"rounded"} sx={{backgroundColor: theme.palette.primary.main}}>
                <PersonAddOutlined/>
              </Avatar>}/>
          <CardContent><Grid container spacing={2}>
            <Grid item xs={12}>
              <MobileDateTimePicker
                label={"Expiration Date"}
                sx={{width: "100%"}}
                value={props.expiresAt?.length ? props.expiresAt : new Date()}
                onChange={props.onExpiresAtChange}
                timezone={"system"}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                options={props.groups}
                getOptionLabel={(option: GroupResponsePublicDto) => option.name}
                loading={props.groupsLoading}
                value={props.selectedGroup}
                onChange={props.onGroupSelect}
                renderInput={(params) => (
                  <TextField {...params} label="Select Group" variant="outlined" required/>)}
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
                  <TextField {...params} label="Select Project" variant="outlined" required/>)}
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
                  <TextField {...params} label="Select Questionnaire" variant="outlined" required/>)}
              />
            </Grid>
            <Grid item xs={12}><Stack spacing={2}>
              <p>The user data must be uploaded as a <code>.csv</code> file.</p>
              <Button
                type="button"
                onClick={props.onDownloadTemplate}
                variant={"contained"}
                color={"success"}
                startIcon={<FileDownload/>}
                sx={{width: "fit-content"}}>
                Download CSV Template
              </Button>
              <TextField
                label="Upload User Data - .csv, max. 400KB"
                type="file"
                required
                variant="outlined"
                name="userData"
                fullWidth
                InputLabelProps={{shrink: true}}
                InputProps={{
                  inputProps: {
                    accept: "text/csv",
                    onChange: props.onFileSelect
                  }
                }}
              />
            </Stack></Grid>
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
