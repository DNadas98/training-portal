import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
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
  debounce,
  Grid,
  MenuItem,
  Select,
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
import {ApiResponsePageableDto} from "../../../common/api/dto/ApiResponsePageableDto.ts";
import URLQueryPagination from "../../../common/pagination/URLQueryPagination.tsx";


export default function ProjectAssignedMembers() {
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
  const [permissionChangeLoading, setPermissionChangeLoading] = useState<boolean>(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [totalPages, setTotalPages] = useState(1);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const size = parseInt(searchParams.get('size') || '10', 10);
  const [usernameSearchValue, setUsernameSearchValue] = useState<string>("");


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

  function getPathByPermissionType(permissionType: PermissionType) {
    const basePath = `groups/${groupId}/projects/${projectId}`
    switch (permissionType) {
      case PermissionType.PROJECT_EDITOR:
        return `${basePath}/editors`;
      case PermissionType.PROJECT_COORDINATOR:
        return `${basePath}/coordinators`;
      case PermissionType.PROJECT_ADMIN:
        return `${basePath}/admins`;
      default:
        return `${basePath}/members`;
    }
  }

  async function loadUsers(searchValue: string, currentPage: number, currentSize: number, currentPermissionType: PermissionType) {
    try {
      setDisplayedUsersLoading(true);
      const path = getPathByPermissionType(currentPermissionType);
      const response = await authJsonFetch({
        path: `${path}?page=${currentPage}&size=${currentSize}&search=${searchValue}`, method: "GET"
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setDisplayedUsers([]);
        return handleErrorNotification(response?.error ?? "Failed to load members list");
      }
      const pageableResponse = response as unknown as ApiResponsePageableDto;
      setDisplayedUsers(response.data);
      const newTotalPages = Number(pageableResponse.totalPages);
      setTotalPages((newTotalPages && newTotalPages > 0) ? newTotalPages : 1);
      const newPage = pageableResponse.currentPage;
      const newSize = pageableResponse.size;
      searchParams.set("page", `${newPage}`);
      searchParams.set("size", `${newSize}`);
      navigate(`?${searchParams.toString()}`, {replace: true});
    } catch (e) {
      setDisplayedUsers([]);
      handleErrorNotification("Failed to load members list");
    } finally {
      setDisplayedUsersLoading(false);
    }
  }

  const reloadUsersDebounced = useRef<(searchValue: string, currentPage: number, currentSize: number, currentPermissionType: PermissionType) => void>();

  useEffect(() => {
    reloadUsersDebounced.current = debounce((searchValue, currentPage, currentSize, currentPermissionType) => {
      loadUsers(searchValue, currentPage, currentSize, currentPermissionType);
    }, 300);
    loadProject();
    loadUsers(usernameSearchValue, page, size, displayedPermissionType);
  }, []);

  const handleUserSearch = (event: any) => {
    const newSearchValue = event.target.value.toLowerCase().trim();
    setUsernameSearchValue(newSearchValue);
    reloadUsersDebounced.current?.(newSearchValue, 1, size, displayedPermissionType);
  };

  const handleDisplayedPermissionTypeChange = (event: any) => {
    const newPermissionType = event.target.value;
    setDisplayedPermissionType(newPermissionType);
    reloadUsersDebounced.current?.(usernameSearchValue, 1, size, newPermissionType);
  }

  function handleSizeChange(newPage: number, newSize: number): void {
    reloadUsersDebounced.current?.(usernameSearchValue, newPage, newSize, displayedPermissionType);
  }

  function handlePageChange(newPage: number): void {
    reloadUsersDebounced.current?.(usernameSearchValue, newPage, size, displayedPermissionType);
  }

  async function removePermission(userId: number, permissionType: PermissionType) {
    try {
      setPermissionChangeLoading(true);
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
      reloadUsersDebounced.current?.(usernameSearchValue, page, size, displayedPermissionType);
    } catch (e) {
      setDisplayedUsers([]);
      handleErrorNotification("Failed to revoke permission");
    } finally {
      setPermissionChangeLoading(false);
    }
  }

  async function addPermission(userId: number, permissionType: PermissionType) {
    try {
      setPermissionChangeLoading(true);
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
      });
      reloadUsersDebounced.current?.(usernameSearchValue, page, size, displayedPermissionType);
    } catch (e) {
      setDisplayedUsers([]);
      handleErrorNotification("Failed to add permission");
    } finally {
      setPermissionChangeLoading(false);
    }
  }

  function handleMemberRemoveClick(userId: number, username: string) {
    dialog.openDialog({
      content: `Do you really want to remove user ${username} from the list of assigned members?
      \nOnly system administrators will be able to reverse this action.`,
      onConfirm: () => removePermission(userId, PermissionType.PROJECT_ASSIGNED_MEMBER)
    });
  }

  function handleEditorRemoveClick(userId: number, username: string) {
    dialog.openDialog({
      content: `Do you really want to revoke editor permission from user ${username}?`,
      onConfirm: () => removePermission(userId, PermissionType.PROJECT_EDITOR)
    });
  }

  function handleCoordinatorRemoveClick(userId: number, username: string) {
    dialog.openDialog({
      content: `Do you really want to revoke coordinator permission from user ${username}?`,
      onConfirm: () => removePermission(userId, PermissionType.PROJECT_COORDINATOR)
    });
  }

  function handleAdminRemoveClick(userId: number, username: string) {
    dialog.openDialog({
      content: `Do you really want to revoke admin permission from user ${username}?`,
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
  const isProjectCoordinator = (permissions: PermissionType[]) => {
    return permissions.includes(PermissionType.PROJECT_COORDINATOR);
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
          <Button sx={{width: "fit-content"}} onClick={() => navigate(`/groups/${groupId}/projects/${projectId}`)}>
            Back to project
          </Button>
        </CardActions>
      </Card> </Grid>
      <Grid item xs={10}><Card>
        <CardHeader title={"Assigned Members"} titleTypographyProps={{variant: "h6"}}/>
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid container spacing={2} alignItems={"center"} justifyContent={"center"}>
                  <Grid item xs={12} md={true}>
                    <TextField type={"search"}
                               placeholder={"Search by username or full name"}
                               fullWidth
                               value={usernameSearchValue}
                               onChange={handleUserSearch}/>
                  </Grid>
                  <Grid item xs={12} md={"auto"}>
                    <URLQueryPagination totalPages={totalPages} defaultPage={1} onPageChange={handlePageChange}
                                        onSizeChange={handleSizeChange}/>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={"auto"}>
                  <Select value={displayedPermissionType} onChange={handleDisplayedPermissionTypeChange}
                          sx={{minWidth: 150}}>
                    <MenuItem value={PermissionType.PROJECT_ASSIGNED_MEMBER}><Typography>
                      All Members
                    </Typography></MenuItem>
                    <MenuItem value={PermissionType.PROJECT_EDITOR}><Typography>
                      Editors
                    </Typography></MenuItem>
                    <MenuItem value={PermissionType.PROJECT_COORDINATOR}><Typography>
                      Coordinators
                    </Typography></MenuItem>
                    <MenuItem value={PermissionType.PROJECT_ADMIN}><Typography>
                      Admins
                    </Typography></MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {displayedUsersLoading
                ? <LoadingSpinner/>
                :
                <TableContainer component={Paper}>
                  <Table sx={{minWidth: 500}}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Full Name</TableCell>
                        <TableCell align="right">Member</TableCell>
                        <TableCell align="right">Editor</TableCell>
                        <TableCell align="right">Coordinator</TableCell>
                        <TableCell align="right">Admin</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayedUsers.map((user) => (
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
                          <TableCell component="th" scope="row">
                            {user.fullName}
                          </TableCell>
                          <TableCell align="right" component="th" scope="row">
                            <Tooltip title={isGroupAdminOrEditor(user.permissions)
                              ? "Group editors or admins can not be removed from assigned members"
                              : "Remove assigned member from project"} arrow>
                              <Checkbox
                                disabled={permissionChangeLoading || isAssignedToProject(user.permissions) && isGroupAdminOrEditor(user.permissions)}
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
                              : "Set editor role of member"} arrow>
                              <Checkbox
                                disabled={permissionChangeLoading || isProjectEditor(user.permissions) && isGroupAdminOrEditor(user.permissions)}
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
                              ? "Coordinator role of group administrators can not be revoked"
                              : "Set coordinator role of member"} arrow>
                              <Checkbox
                                disabled={permissionChangeLoading || isProjectCoordinator(user.permissions) && isGroupAdmin(user.permissions)}
                                checked={isProjectCoordinator(user.permissions)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    addPermission(user.userId, PermissionType.PROJECT_COORDINATOR);
                                  } else {
                                    handleCoordinatorRemoveClick(user.userId, user.username);
                                  }
                                }}
                              />
                            </Tooltip>
                          </TableCell>
                          <TableCell align="right" component="th" scope="row">
                            <Tooltip title={isGroupAdmin(user.permissions)
                              ? "Admin role of group administrators can not be revoked"
                              : "Set admin role of member"} arrow>
                              <Checkbox
                                disabled={permissionChangeLoading || isProjectAdmin(user.permissions) && isGroupAdmin(user.permissions)}
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
              }
            </Grid>
          </Grid>

        </CardContent>
      </Card> </Grid>
    </Grid>
  );
}
