import {AppBar, Box, Divider, Stack, Toolbar, Typography, useTheme} from "@mui/material";
import ThemePaletteModeSwitch from "../../common/theme/components/ThemePaletteModeSwitch.tsx";
import SiteLogo from "../../common/utils/components/SiteLogo.tsx";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import {GroupResponsePublicDto} from "../dto/GroupResponsePublicDto.ts";
import LocaleMenu from "../../common/menu/LocaleMenu.tsx";
import useLocalizedDate from "../../common/localization/hooks/useLocalizedDate.tsx";
import {ProjectResponsePublicDto} from "../../projects/dto/ProjectResponsePublicDto.ts";
import {PermissionType} from "../../authentication/dto/PermissionType.ts";
import {IMenuItem} from "../../common/menu/IMenuItem.ts";
import LoggedInMenu from "../../common/menu/LoggedInMenu.tsx";
import AccountMenu from "../../common/menu/AccountMenu.tsx";
import useLocalized from "../../common/localization/hooks/useLocalized.tsx";

interface GroupHeaderProps {
  group: undefined | GroupResponsePublicDto,
  project: ProjectResponsePublicDto | undefined,
  permissionsLoading: boolean,
  groupPermissions: PermissionType[],
  projectPermissions: PermissionType[]
}

export default function GroupHeader(props: GroupHeaderProps) {
  const theme = useTheme();
  const getLocalizedDate = useLocalizedDate();
  const localized = useLocalized();

  function getGroupMenuItems() {
    const items: IMenuItem[] = [{path: `/groups/${props?.group?.groupId}`, title: localized("menus.group_dashboard")},
      {path: `/groups/${props?.group?.groupId}/projects`, title: localized("menus.projects")}];
    if (props.groupPermissions.includes(PermissionType.GROUP_EDITOR)) {
      items.push({
        path: `/groups/${props?.group?.groupId}/update`, title: "Update Details"
      })
    }
    if (props.groupPermissions.includes(PermissionType.GROUP_ADMIN)) {
      items.push({
        path: `/groups/${props?.group?.groupId}/requests`, title: "Join Requests"
      })
    }
    return items;
  }

  function getProjectMenuItems() {
    const items: IMenuItem[] = [{
      path: `/groups/${props?.group?.groupId}/projects/${props?.project?.projectId}`,
      title: localized("menus.project_dashboard")
    }];
    if (props.projectPermissions.includes(PermissionType.PROJECT_EDITOR)) {
      items.push({
        path: `/groups/${props?.group?.groupId}/projects/${props?.project?.projectId}/editor/questionnaires`,
        title: localized("menus.edit_questionnaires")
      });
    }
    if (props.projectPermissions.includes(PermissionType.PROJECT_COORDINATOR)) {
      items.push({
        path: `/groups/${props?.group?.groupId}/projects/${props?.project?.projectId}/coordinator/questionnaires`,
        title: localized("menus.questionnaire_statistics")
      });
    }
    if (props.projectPermissions.includes(PermissionType.PROJECT_ADMIN)) {
      items.push({
        path: `/groups/${props?.group?.groupId}/projects/${props?.project?.projectId}/requests`,
        title: localized("menus.join_requests")
      });
      items.push({
        path: `/groups/${props?.group?.groupId}/projects/${props?.project?.projectId}/members`,
        title: localized("menus.assigned_members")
      });
      items.push({
        path: `/groups/${props?.group?.groupId}/projects/${props?.project?.projectId}/update`,
        title: localized("menus.update_details")
      });
    }
    return items;
  }

  return (
    <AppBar position="static" sx={{marginBottom: 4}}>
      <Toolbar>
        <SiteLogo/>
        <Box flexGrow={1}></Box>
        <LoggedInMenu/>
        <AccountMenu/>
        <LocaleMenu/>
        <ThemePaletteModeSwitch/>
      </Toolbar>
      {
        props.group
          ? <>
            <Divider color={theme.palette.background.default}/>
            <Toolbar variant={"dense"}>
              <Stack direction={"row"}
                     alignItems={"baseline"}
                     spacing={1}
                     flexWrap={"wrap"}
                     flexGrow={1}>
                {props.permissionsLoading
                  ? <></>
                  : props.group?.name
                    ? <MenuSmall title={props.group.name}
                                 items={getGroupMenuItems()}/>
                    : <></>
                }
                {props.project?.name
                  ? <>
                    <Typography variant={"body1"}>
                      /
                    </Typography>
                    <MenuSmall
                      title={props.project.name}
                      items={getProjectMenuItems()}/>
                    <Typography variant={"body2"}>
                      ( {getLocalizedDate(props.project.startDate)} - {getLocalizedDate(props.project.deadline)} )
                    </Typography>
                  </>
                  : <></>
                }
              </Stack>
            </Toolbar>
          </>
          : <></>
      }
    </AppBar>
  );
}
