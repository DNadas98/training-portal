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
import useLocalized from "../../../../common/localization/hooks/useLocalized.tsx";

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
  const localized = useLocalized();
  return (<>
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"} mb={2}>
      <Grid item xs={10} sm={8} md={10} lg={8}>
        <Card><CardActions><Button
          onClick={props.handleBackClick}>{localized("pages.projects.back_to_group_dashboard")}</Button></CardActions></Card>
      </Grid></Grid>
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={10} sm={8} md={5} lg={4}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={localized("pages.projects.your_projects")}/>
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
                           label={localized("inputs.search")}
                           fullWidth
                           onInput={props.handleProjectsWithUserSearch}
                />
              </Stack>
            </CardContent>
          </Card>
          <ProjectList loading={props.projectsWithUserLoading}
                       projects={props.projectsWithUser}
                       notFoundText={localized("pages.projects.not_found")}
                       onActionButtonClick={props.handleViewDashboardClick}
                       userIsMember={true}
                       actionButtonDisabled={props.actionButtonDisabled}/>
        </Stack>
      </Grid>
      <Grid item xs={10} sm={8} md={5} lg={4}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={localized("pages.projects.projects_to_join")}/>
            <CardContent>
              <TextField variant={"standard"} type={"search"} fullWidth
                         label={localized("inputs.search")}
                         onInput={props.handleProjectsWithoutUserSearch}
              />
            </CardContent>
          </Card>
          <ProjectList loading={props.projectsWithoutUserLoading}
                       projects={props.projectsWithoutUser}
                       notFoundText={localized("pages.projects.not_found")}
                       onActionButtonClick={props.handleJoinRequestClick}
                       userIsMember={false}
                       actionButtonDisabled={props.actionButtonDisabled}/>
        </Stack>
      </Grid>
    </Grid>
  </>)
}
