import {GroupResponsePublicDto} from "../../../dto/GroupResponsePublicDto.ts";
import {Card, CardContent, CardHeader, Grid, IconButton, Stack, TextField, Tooltip} from "@mui/material";
import GroupList from "./GroupList.tsx";
import {FormEvent} from "react";
import AddIcon from "../../../../common/utils/components/AddIcon.tsx";
import {Link} from "react-router-dom";
import useLocalized from "../../../../common/localization/hooks/useLocalized.tsx";

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
  const localized = useLocalized();
  return (
    <Grid container spacing={2} justifyContent={"center"} alignItems={"top"}>
      <Grid item xs={10} sm={8} md={5} lg={4}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={localized("pages.groups.browser.your_groups")}/>
            <CardContent>
              <Stack spacing={2} direction={"row"}>
                {props.isGlobalAdmin
                  ? <Tooltip title={localized("pages.groups.browser.add_new_group")} arrow>
                    <IconButton component={Link} to={"/groups/create"}>
                      <AddIcon/>
                    </IconButton>
                  </Tooltip>
                  : <></>}
                <TextField variant={"standard"} type={"search"}
                           label={localized("inputs.search")}
                           fullWidth
                           onInput={props.handleGroupsWithUserSearch}
                />
              </Stack>
            </CardContent>
          </Card>
          <GroupList loading={props.groupsWithUserLoading}
                     groups={props.groupsWithUser}
                     notFoundText={localized("pages.groups.browser.groups_not_found")}
                     onActionButtonClick={props.handleViewDashboardClick}
                     userIsMember={true}
                     actionButtonDisabled={props.actionButtonDisabled}/>
        </Stack>
      </Grid>
      <Grid item xs={10} sm={8} md={5} lg={4}>
        <Stack spacing={2}>
          <Card>
            <CardHeader title={localized("pages.groups.browser.groups_to_join")}/>
            <CardContent>
              <TextField variant={"standard"} type={"search"} fullWidth
                         label={localized("inputs.search")}
                         onInput={props.handleGroupsWithoutUserSearch}
              />
            </CardContent>
          </Card>
          <GroupList loading={props.groupsWithoutUserLoading}
                     groups={props.groupsWithoutUser}
                     notFoundText={localized("pages.groups.browser.groups_not_found")}
                     onActionButtonClick={props.handleJoinRequestClick}
                     userIsMember={false}
                     actionButtonDisabled={props.actionButtonDisabled}/>
        </Stack>
      </Grid>
    </Grid>
  )
}
