import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip
} from "@mui/material";
import ProjectList from "./ProjectList.tsx";
import {FormEvent} from "react";
import {PermissionType} from "../../../../authentication/dto/PermissionType.ts";
import AddIcon from "../../../../common/utils/components/AddIcon.tsx";
import {ProjectResponsePublicDto} from "../../../dto/ProjectResponsePublicDto.ts";

interface ProjectBrowserProps {
  projectsWithUserLoading: boolean,
  projectsWithUser: ProjectResponsePublicDto[],
  projectsWithoutUserLoading: boolean,
  projectsWithoutUser: ProjectResponsePublicDto[],
  handleProjectsWithUserSearch: (event: FormEvent<HTMLInputElement>) => void,
  handleProjectsWithoutUserSearch: (event: FormEvent<HTMLInputElement>) => void,
  handleViewDashboardClick: (projectId: number) => unknown,
  handleJoinRequestClick: (projectId: number) => Promise<void>
  actionButtonDisabled: boolean;
  handleAddButtonClick: () => void;
  handleBackClick: () => void;
  groupPermissions: PermissionType[];
}

export default function ProjectBrowser(props: ProjectBrowserProps) {
  return (<>
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"} mb={2}>
      <Grid item xs={10} sm={8} md={10} lg={8}>
        <Card><CardActions><Button onClick={props.handleBackClick}>Back to group dashboard</Button></CardActions></Card>
      </Grid></Grid>
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={10} sm={8} md={5} lg={4}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={"Your projects"} sx={{textAlign: "center"}}/>
            <CardContent>
              <Stack direction={"row"} spacing={1} alignItems={"baseline"}>
                {props.groupPermissions.includes(PermissionType.GROUP_ADMIN) &&
                  <Tooltip title={"Add new project"} arrow>
                    <IconButton onClick={props.handleAddButtonClick}>
                      <AddIcon/>
                    </IconButton>
                  </Tooltip>
                }
                <TextField variant={"standard"} type={"search"}
                           label={"Search"}
                           fullWidth
                           onInput={props.handleProjectsWithUserSearch}
                />
              </Stack>
            </CardContent>
          </Card>
          <ProjectList loading={props.projectsWithUserLoading}
                       projects={props.projectsWithUser}
                       notFoundText={"We haven't found any projects."}
                       onActionButtonClick={props.handleViewDashboardClick}
                       userIsMember={true}
                       actionButtonDisabled={props.actionButtonDisabled}/>
        </Stack>
      </Grid>
      <Grid item xs={10} sm={8} md={5} lg={4}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={"Projects to join"} sx={{textAlign: "center"}}/>
            <CardContent>
              <TextField variant={"standard"} type={"search"} fullWidth
                         label={"Search"}
                         onInput={props.handleProjectsWithoutUserSearch}
              />
            </CardContent>
          </Card>
          <ProjectList loading={props.projectsWithoutUserLoading}
                       projects={props.projectsWithoutUser}
                       notFoundText={"We haven't found any projects to join."}
                       onActionButtonClick={props.handleJoinRequestClick}
                       userIsMember={false}
                       actionButtonDisabled={props.actionButtonDisabled}/>
        </Stack>
      </Grid>
    </Grid>
  </>)
}
