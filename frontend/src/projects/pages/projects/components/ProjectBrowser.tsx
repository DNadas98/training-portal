import {
    Card,
    CardContent,
    CardHeader,
    Grid,
    IconButton,
    Stack,
    TextField
} from "@mui/material";
import ProjectList from "./ProjectList.tsx";
import {FormEvent} from "react";
import {PermissionType} from "../../../../authentication/dto/PermissionType.ts";
import AddIcon from "../../../../common/utils/components/AddIcon.tsx";
import {ProjectResponseDetailsDto} from "../../../dto/ProjectResponseDetailsDto.ts";

interface ProjectBrowserProps {
    projectsWithUserLoading: boolean,
    projectsWithUser: ProjectResponseDetailsDto[],
    projectsWithoutUserLoading: boolean,
    projectsWithoutUser: ProjectResponseDetailsDto[],
    handleProjectsWithUserSearch: (event: FormEvent<HTMLInputElement>) => void,
    handleProjectsWithoutUserSearch: (event: FormEvent<HTMLInputElement>) => void,
    handleViewDashboardClick: (projectId: number) => unknown,
    handleJoinRequestClick: (projectId: number) => Promise<void>
    actionButtonDisabled: boolean;
    handleAddButtonClick: () => void;
    groupPermissions: PermissionType[];
}

export default function ProjectBrowser(props: ProjectBrowserProps) {
    return (
        <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
            <Grid item xs={10} sm={8} md={5} lg={4}>
                <Stack spacing={2}>
                    <Card>
                        <CardHeader title={"Your projects"} sx={{textAlign: "center"}}/>
                        <CardContent>
                            <Stack direction={"row"} spacing={1} alignItems={"baseline"}>
                                {props.groupPermissions.includes(PermissionType.GROUP_ADMIN) &&
                                    <IconButton onClick={props.handleAddButtonClick}>
                                        <AddIcon/>
                                    </IconButton>
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
    )
}
