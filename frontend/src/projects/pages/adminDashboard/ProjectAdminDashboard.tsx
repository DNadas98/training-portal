import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {PermissionType} from "../../../authentication/dto/PermissionType.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {ProjectResponseDetailsDto} from "../../dto/ProjectResponseDetailsDto.ts";
import {isValidId} from "../../../common/utils/isValidId.ts";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";
import useLocalizedDateTime from "../../../common/localization/hooks/useLocalizedDateTime.tsx";
import {UserResponseWithPermissionsDto} from "../../../user/dto/UserResponseWithPermissionsDto.ts";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export default function ProjectAdminDashboard() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const dialog = useDialog();
  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const [projectLoading, setProjectLoading] = useState(true);
  const [project, setProject] = useState<ProjectResponseDetailsDto | undefined>(undefined);
  const [projectError, setProjectError] = useState<string | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const getLocalizedDateTime = useLocalizedDateTime();
  const [displayedUsers, setDisplayedUsers] = useState<UserResponseWithPermissionsDto[]>([]);
  const [displayedUsersLoading, setDisplayedUsersLoading] = useState<boolean>(true);
  const [displayedPermissionType, setDisplayedPermissionType] = useState<PermissionType>(PermissionType.PROJECT_ASSIGNED_MEMBER)

  function handleErrorNotification(message?: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: `${message ?? "Failed to load project"}`
    });
  }

  async function loadProject() {
    try {
      setProjectLoading(true);
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setProjectError("The provided group or project ID is invalid");
        setProjectLoading(false);
        return;
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/details`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setProjectError(response?.error ?? `Failed to load project`);
        return handleErrorNotification(response?.error);
      }
      const projectData = {
        ...response.data,
        startDate: new Date(response.data.startDate as string),
        deadline: new Date(response.data.deadline as string)
      };
      setProject(projectData as ProjectResponseDetailsDto);
    } catch (e) {
      setProject(undefined);
      setProjectError("Failed to load project");
      handleErrorNotification();
    } finally {
      setProjectLoading(false);
    }
  }

  function getPathByPermissionType(permissionType: PermissionType = displayedPermissionType) {
    const basePath = `groups/${groupId}/projects/${projectId}`
    switch (permissionType) {
      case PermissionType.PROJECT_EDITOR:
        return `${basePath}/editors`;
      case PermissionType.PROJECT_ADMIN:
        return `${basePath}/admins`;
      default:
        return `${basePath}/members`;
    }
  }

  async function loadUsers() {
    try {
      setDisplayedUsersLoading(true);
      const path = getPathByPermissionType();
      const response = await authJsonFetch({
        path: path, method: "GET"
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setDisplayedUsers([]);
        return handleErrorNotification(response?.error ?? "Failed to load assigned members list");
      }
      setDisplayedUsers(response.data);
    } catch (e) {
      setDisplayedUsers([]);
      handleErrorNotification("Failed to load assigned members list");
    } finally {
      setDisplayedUsersLoading(false);
    }
  }

  useEffect(() => {
    loadProject()
  }, []);

  useEffect(() => {
    loadUsers()
  }, [displayedPermissionType]);

  const [usersFilterValue, setUsersFilterValue] = useState<string>("");
  const displayedUsersFiltered = useMemo(() => {
    if (!displayedUsers?.length) {
      return [];
    }
    return displayedUsers.filter(user => {
        return user.username.toLowerCase().includes(usersFilterValue)
      }
    );
  }, [displayedUsers, usersFilterValue]);

  const handleUserSearch = (event: any) => {
    setUsersFilterValue(event.target.value.toLowerCase().trim());
  };

  async function deleteProject() {
    try {
      setProjectLoading(true);
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setProjectError("The provided group or project ID is invalid");
        setProjectLoading(false);
        return;
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}`, method: "DELETE"
      });
      if (!response?.status || response.status > 404 || !response?.message) {
        return handleErrorNotification(response?.error ?? "Failed to remove project data");
      }

      setProject(undefined);
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? "All project data has been removed successfully"
      });
      navigate(`/groups/${groupId}`, {replace: true});
    } catch (e) {
      handleErrorNotification("Failed to remove project data");
    } finally {
      setProjectLoading(false);
    }
  }

  function handleDeleteClick() {
    dialog.openDialog({
      text: "Do you really wish to remove all project data, including all questionnaires and questionnaire submissions? This action is irreversible.",
      confirmText: "Yes, delete this project", onConfirm: deleteProject
    });
  }

  function handleJoinRequestClick() {
    navigate(`/groups/${groupId}/projects/${projectId}/requests`);
  }

  async function removePermission(userId: number, permissionType: PermissionType) {
    try {
      setDisplayedUsersLoading(true);
      const path = getPathByPermissionType(permissionType);
      const response = await authJsonFetch({
        path: `${path}/${userId}`, method: "DELETE"
      });
      if (!response?.status || response.status > 404 || !response?.message) {
        setDisplayedUsers([]);
        return handleErrorNotification(response?.error ?? "Failed to revoke permission");
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center", message: response.message
      })
      loadUsers();
    } catch (e) {
      setDisplayedUsers([]);
      handleErrorNotification("Failed to revoke permission");
    } finally {
      setDisplayedUsersLoading(false);
    }
  }

  async function addPermission(userId: number, permissionType: PermissionType) {
    try {
      setDisplayedUsersLoading(true);
      const path = getPathByPermissionType(permissionType);
      const response = await authJsonFetch({
        path: `${path}?userId=${userId}`, method: "POST"
      });
      if (!response?.status || response.status > 404 || !response?.message) {
        setDisplayedUsers([]);
        return handleErrorNotification(response?.error ?? "Failed to add permission");
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center", message: response.message
      })
      loadUsers();
    } catch (e) {
      setDisplayedUsers([]);
      handleErrorNotification("Failed to add permission");
    } finally {
      setDisplayedUsersLoading(false);
    }
  }

  function handleMemberRemoveClick(userId: number, username: string) {
    dialog.openDialog({
      text: `Do you really want to remove user ${username} from the list of assigned members?
      \nOnly system administrators will be able to reverse this action.`,
      onConfirm: () => removePermission(userId, PermissionType.PROJECT_ASSIGNED_MEMBER)
    });
  }

  function handleEditorRemoveClick(userId: number, username: string) {
    dialog.openDialog({
      text: `Do you really want to revoke editor permission from user ${username}?`,
      onConfirm: () => removePermission(userId, PermissionType.PROJECT_EDITOR)
    });
  }

  function handleAdminRemoveClick(userId: number, username: string) {
    dialog.openDialog({
      text: `Do you really want to revoke admin permission from user ${username}?`,
      onConfirm: () => removePermission(userId, PermissionType.PROJECT_ADMIN)
    });
  }

  const isGroupAdmin = (permissions: PermissionType[]) => {
    return permissions.includes(PermissionType.GROUP_ADMIN);
  }
  const isGroupAdminOrEditor = (permissions: PermissionType[]) => {
    return permissions.includes(PermissionType.GROUP_ADMIN)
      || permissions.includes(PermissionType.GROUP_EDITOR);
  }
  const isAssignedToProject = (permissions: PermissionType[]) => {
    return permissions.includes(PermissionType.PROJECT_ASSIGNED_MEMBER);
  }
  const isProjectEditor = (permissions: PermissionType[]) => {
    return permissions.includes(PermissionType.PROJECT_EDITOR);
  }
  const isProjectAdmin = (permissions: PermissionType[]) => {
    return permissions.includes(PermissionType.PROJECT_ADMIN);
  }


  if (permissionsLoading || projectLoading) {
    return <LoadingSpinner/>;
  } else if ((!projectPermissions?.length) || !projectPermissions.includes(PermissionType.PROJECT_ADMIN)) {
    handleErrorNotification("Access Denied: Insufficient permissions");
    navigate(`/groups/${groupId}/projects/${projectId}`, {replace: true});
    return <></>;
  } else if (!project) {
    handleErrorNotification(projectError ?? "Failed to load project");
    navigate(`/groups/${groupId}/projects`, {replace: true});
    return <></>;
  }

  return (
    <Grid container justifyContent={"center"} alignItems={"center"} spacing={2}>
      <Grid item xs={10}><Card>
        <CardHeader title={project.name} titleTypographyProps={{variant: "h4"}}/>
        <CardContent>
          <Typography gutterBottom>{project.description}</Typography>
          <Typography>
            Start Date: {getLocalizedDateTime(project.startDate)}
          </Typography>
          <Typography>
            Deadline: {getLocalizedDateTime(project.deadline)}
          </Typography>
        </CardContent>
        <CardActions>
          <Stack spacing={0.5}>
            <Button sx={{width: "fit-content"}} onClick={() => navigate(`/groups/${groupId}/projects/${projectId}`)}>
              Back to project
            </Button>
            <Button sx={{width: "fit-content"}} onClick={handleJoinRequestClick}>
              View project join requests
            </Button>
            <Button sx={{width: "fit-content"}} onClick={() => {
              navigate(`/groups/${groupId}/projects/${projectId}/update`);
            }}>
              Update project details
            </Button>
            <Button sx={{width: "fit-content"}} onClick={handleDeleteClick}>
              Remove project
            </Button>
          </Stack>
        </CardActions>
      </Card> </Grid>
      <Grid item xs={10}><Card>
        <CardHeader title={"Assigned Members"} titleTypographyProps={{variant: "h6"}}/>
        <CardContent>
          {displayedUsersLoading
            ? <LoadingSpinner/>
            : <Grid container>
              <Grid item xs={12}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={true}>
                    <TextField type={"search"}
                               placeholder={"Search by username"}
                               fullWidth
                               onChange={handleUserSearch}/>
                  </Grid>
                  <Grid item xs={12} sm={"auto"}>
                    <Select value={displayedPermissionType} onChange={(event: any) => {
                      setDisplayedPermissionType(event.target.value);
                    }}
                            sx={{minWidth: 150}}>
                      <MenuItem value={PermissionType.PROJECT_ASSIGNED_MEMBER}><Typography>
                        All Members
                      </Typography></MenuItem>
                      <MenuItem value={PermissionType.PROJECT_EDITOR}><Typography>
                        Editors
                      </Typography></MenuItem>
                      <MenuItem value={PermissionType.PROJECT_ADMIN}><Typography>
                        Admins
                      </Typography></MenuItem>
                    </Select>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table sx={{minWidth: 500}}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell align="right">Member</TableCell>
                        <TableCell align="right">Editor</TableCell>
                        <TableCell align="right">Admin</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayedUsersFiltered.map((user) => (
                        <TableRow
                          key={user.userId}
                          sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                          <TableCell component="th" scope="row">
                            {user.username}{isGroupAdmin(user.permissions)
                            ? " - Group Admin"
                            : isGroupAdminOrEditor(user.permissions)
                              ? " - Group Editor"
                              : ""}
                          </TableCell>
                          <TableCell align="right" component="th" scope="row">
                            <Tooltip title={isGroupAdminOrEditor(user.permissions)
                              ? "Group editors or admins can not be removed from assigned members"
                              : "Remove assigned member from project"} arrow>
                              <Checkbox
                                disabled={isGroupAdminOrEditor(user.permissions)}
                                checked={isAssignedToProject(user.permissions)}
                                onChange={(e) => {
                                  if (!e.target.checked) {
                                    handleMemberRemoveClick(user.userId, user.username);
                                  }
                                }}
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell align="right" component="th" scope="row">
                            <Tooltip title={isGroupAdminOrEditor(user.permissions)
                              ? "Editor role of group editors or administrators can not be revoked"
                              : "Revoke editor role of member"} arrow>
                              <Checkbox
                                disabled={isGroupAdminOrEditor(user.permissions)}
                                checked={isProjectEditor(user.permissions)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    addPermission(user.userId, PermissionType.PROJECT_EDITOR);
                                  } else {
                                    handleEditorRemoveClick(user.userId, user.username);
                                  }
                                }}
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell align="right" component="th" scope="row">
                            <Tooltip title={isGroupAdmin(user.permissions)
                              ? "Admin role of group administrators can not be revoked"
                              : "Revoke admin role of member"} arrow>
                              <Checkbox
                                disabled={isGroupAdmin(user.permissions)}
                                checked={isProjectAdmin(user.permissions)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    addPermission(user.userId, PermissionType.PROJECT_ADMIN);
                                  } else {
                                    handleAdminRemoveClick(user.userId, user.username);
                                  }
                                }}
                              />
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          }
        </CardContent>
      </Card> </Grid>
    </Grid>
  );
}
