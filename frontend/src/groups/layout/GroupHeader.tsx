import {AppBar, Box, Divider, Stack, Toolbar, Typography, useMediaQuery, useTheme} from "@mui/material";
import ThemePaletteModeSwitch
  from "../../common/theme/components/ThemePaletteModeSwitch.tsx";
import SiteNameH6 from "../../common/utils/components/SiteNameH6.tsx";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import MenuLarge from "../../common/utils/components/MenuLarge.tsx";
import {loggedInMenuItems} from "../../common/menu/loggedInMenuItems.tsx";
import {useAuthentication} from "../../authentication/hooks/useAuthentication.ts";
import {AccountBoxRounded, MenuOutlined} from "@mui/icons-material";
import {accountMenuItems} from "../../common/menu/accountMenuItems.tsx";
import {GroupResponsePublicDto} from "../dto/GroupResponsePublicDto.ts";
import {ProjectResponseDetailsDto} from "../../projects/dto/ProjectResponseDetailsDto.ts";

interface GroupHeaderProps {
  group: undefined | GroupResponsePublicDto,
  project: ProjectResponseDetailsDto | undefined
}

export default function GroupHeader(props: GroupHeaderProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const authentication = useAuthentication();
  return (
    <AppBar position="static" sx={{marginBottom: 4}}>
      <Toolbar>
        <SiteNameH6/>
        <Box flexGrow={1}></Box>
        {isSmallScreen
          ? <MenuSmall items={loggedInMenuItems} icon={<MenuOutlined/>}/>
          : <MenuLarge items={loggedInMenuItems}/>
        }
        <MenuSmall items={accountMenuItems}
                   icon={<AccountBoxRounded/>}
                   title={(authentication.getUsername() as string)}/>
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
                {props.group?.name
                  ? <MenuSmall title={props.group.name}
                               items={[{path: `/groups/${props.group.groupId}`, title: "Group Dashboard"},
                                 {path: `/groups/${props.group.groupId}/projects`, title: "Projects"},
                               ]}/>
                  : <></>
                }
                {props.project?.name
                  ? <>
                    <Typography variant={"body1"}>
                      /
                    </Typography>
                    <MenuSmall
                      title={props.project.name}
                      items={[
                        {
                          path: `/groups/${props.group.groupId}/projects/${props.project.projectId}`,
                          title: "Project Dashboard"
                        },
                        {
                          path: `/groups/${props.group.groupId}/projects/${props.project.projectId}/questionnaires`,
                          title: "Questionnaires"
                        }
                      ]}/>
                    <Typography variant={"body2"}>
                      ( {props.project.startDate.toLocaleDateString()} - {props.project.deadline.toLocaleDateString()} )
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
