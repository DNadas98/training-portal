import {GroupResponsePublicDto} from "../../../dto/GroupResponsePublicDto.ts";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Stack,
  TextField
} from "@mui/material";
import GroupList from "./GroupList.tsx";
import {AddOutlined} from "@mui/icons-material";
import {FormEvent} from "react";
import {useNavigate} from "react-router-dom";

interface GroupBrowserProps {
  groupsWithUserLoading: boolean,
  groupsWithUser: GroupResponsePublicDto[],
  groupsWithoutUserLoading: boolean,
  groupsWithoutUser: GroupResponsePublicDto[],
  handleGroupsWithUserSearch: (event: FormEvent<HTMLInputElement>) => void,
  handleGroupsWithoutUserSearch: (event: FormEvent<HTMLInputElement>) => void,
  handleViewDashboardClick: (groupId: number) => unknown,
  handleJoinRequestClick: (groupId: number) => Promise<void>
  actionButtonDisabled: boolean;
}

export default function GroupBrowser(props: GroupBrowserProps) {
  const navigate = useNavigate();

  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={10} sm={8} md={5} lg={4}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={"Your groups"} sx={{textAlign: "center"}}/>
            <CardContent>
              <Stack direction={"row"} spacing={1} alignItems={"baseline"}>
                <IconButton onClick={() => {
                  navigate("/groups/create")
                }}>
                  <Avatar variant={"rounded"}
                          sx={{
                            bgcolor: "secondary.main",
                            color: "background.paper"
                          }}>
                    <AddOutlined color={"inherit"}/>
                  </Avatar>
                </IconButton>
                <TextField variant={"standard"} type={"search"}
                           label={"Search"}
                           fullWidth
                           onInput={props.handleGroupsWithUserSearch}
                />
              </Stack>
            </CardContent>
          </Card>
          <GroupList loading={props.groupsWithUserLoading}
                     groups={props.groupsWithUser}
                     notFoundText={"We haven't found any groups."}
                     onActionButtonClick={props.handleViewDashboardClick}
                     userIsMember={true}
                     actionButtonDisabled={props.actionButtonDisabled}/>
        </Stack>
      </Grid>
      <Grid item xs={10} sm={8} md={5} lg={4}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={"Groups to join"} sx={{textAlign: "center"}}/>
            <CardContent>
              <TextField variant={"standard"} type={"search"} fullWidth
                         sx={{marginBottom: 1}}
                         label={"Search"}
                         onInput={props.handleGroupsWithoutUserSearch}
              />
            </CardContent>
          </Card>
          <GroupList loading={props.groupsWithoutUserLoading}
                     groups={props.groupsWithoutUser}
                     notFoundText={"We haven't found any groups to join."}
                     onActionButtonClick={props.handleJoinRequestClick}
                     userIsMember={false}
                     actionButtonDisabled={props.actionButtonDisabled}/>
        </Stack>
      </Grid>
    </Grid>
  )
}
