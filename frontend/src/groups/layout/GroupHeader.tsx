import {AppBar, Box, Divider, Stack, Toolbar, Typography, useTheme} from "@mui/material";
import ThemePaletteModeSwitch from "../../common/theme/components/ThemePaletteModeSwitch.tsx";
import SiteLogo from "../../common/utils/components/SiteLogo.tsx";
import MenuSmall from "../../common/utils/components/MenuSmall.tsx";
import MenuLarge from "../../common/utils/components/MenuLarge.tsx";
import {loggedInMenuItems} from "../../common/menu/loggedInMenuItems.tsx";
import {useAuthentication} from "../../authentication/hooks/useAuthentication.ts";
import {AccountBoxRounded, MenuOutlined} from "@mui/icons-material";
import {accountMenuItems} from "../../common/menu/accountMenuItems.tsx";
import {GroupResponsePublicDto} from "../dto/GroupResponsePublicDto.ts";
import LocaleMenu from "../../common/localization/components/LocaleMenu.tsx";
import IsSmallScreen from "../../common/utils/IsSmallScreen.tsx";
import useLocalizedDate from "../../common/localization/hooks/useLocalizedDate.tsx";
import {ProjectResponsePublicDto} from "../../projects/dto/ProjectResponsePublicDto.ts";

interface GroupHeaderProps {
  group: undefined | GroupResponsePublicDto,
  project: ProjectResponsePublicDto | undefined
}

export default function GroupHeader(props: GroupHeaderProps) {
  const theme = useTheme();
  const isSmallScreen = IsSmallScreen();
  const authentication = useAuthentication();
  const getLocalizedDate = useLocalizedDate();

  return (
    <AppBar position="static" sx={{marginBottom: 4}}>
      <Toolbar>
        <SiteLogo/>
        <Box flexGrow={1}></Box>
        {isSmallScreen
          ? <MenuSmall items={loggedInMenuItems} icon={<MenuOutlined/>}/>
          : <MenuLarge items={loggedInMenuItems}/>
        }
        <MenuSmall items={accountMenuItems}
                   icon={<AccountBoxRounded/>}
                   title={(authentication.getUsername() as string)}/>
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
                        }
                      ]}/>
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
