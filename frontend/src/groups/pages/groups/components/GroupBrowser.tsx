import {GroupResponsePublicDto} from "../../../dto/GroupResponsePublicDto.ts";
import {
  Card,
  CardContent,
  CardHeader,
  Grid, IconButton,
  Stack,
  TextField,
  Tooltip
} from "@mui/material";
import GroupList from "./GroupList.tsx";
import {FormEvent} from "react";
import AddIcon from "../../../../common/utils/components/AddIcon.tsx";
import {Link} from "react-router-dom";

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
  isGlobalAdmin: boolean | undefined;
}

export default function GroupBrowser(props: GroupBrowserProps) {

  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={10} sm={8} md={5} lg={4}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={"Your groups"} sx={{textAlign: "center"}}/>
            <CardContent>
              <Stack spacing={2} direction={"row"}>
                {props.isGlobalAdmin
                  ? <Tooltip title={"Add new group"} arrow>
                    <IconButton component={Link} to={"/groups/create"}>
                      <AddIcon/>
                    </IconButton>
                  </Tooltip>
                  : <></>}
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
