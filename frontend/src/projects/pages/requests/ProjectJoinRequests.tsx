import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {ProjectJoinRequestResponseDto} from "../../dto/requests/ProjectJoinRequestResponseDto.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {RequestStatus} from "../../../groups/dto/RequestStatus.ts";
import {PermissionType} from "../../../authentication/dto/PermissionType.ts";
import {isValidId} from "../../../common/utils/isValidId.ts";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  debounce,
  Grid,
  List,
  ListItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";
import {ApiResponsePageableDto} from "../../../common/api/dto/ApiResponsePageableDto.ts";
import URLQueryPagination from "../../../common/pagination/URLQueryPagination.tsx";

export default function ProjectJoinRequests() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const dialog = useDialog();
  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const [projectJoinRequestsLoading, setProjectJoinRequestsLoading] = useState(true);
  const [projectJoinRequests, setProjectJoinRequests] = useState<ProjectJoinRequestResponseDto[]>([]);
  const [projectJoinRequestError, setProjectJoinRequestError] = useState<string | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [totalPages, setTotalPages] = useState(1);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const size = parseInt(searchParams.get('size') || '10', 10);
  const [usernameSearchValue, setUsernameSearchValue] = useState<string>("");

  function handleErrorNotification(message: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: message
    });
  }

  async function loadProjectJoinRequests(searchValue: string, currentPage: number, currentSize: number) {
    const defaultError = `Failed to load project join requests`;
    try {
      setProjectJoinRequestsLoading(true);
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setProjectJoinRequestError("The provided project ID is invalid");
        return;
      }
      const response = await authJsonFetch({
        path:
          `groups/${groupId}/projects/${projectId}/requests?page=${currentPage}&size=${currentSize}&search=${searchValue}`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setProjectJoinRequestError(response?.error ?? defaultError);
        return;
      }
      const pageableResponse = response as unknown as ApiResponsePageableDto;
      setProjectJoinRequests(pageableResponse.data as ProjectJoinRequestResponseDto[]);
      const newTotalPages = Number(pageableResponse.totalPages);
      setTotalPages((newTotalPages && newTotalPages > 0) ? newTotalPages : 1);
      const newPage = pageableResponse.currentPage;
      const newSize = pageableResponse.size;
      searchParams.set("page", `${newPage}`);
      searchParams.set("size", `${newSize}`);
      navigate(`?${searchParams.toString()}`, {replace: true});
    } catch (e) {
      setProjectJoinRequests([]);
      setProjectJoinRequestError(defaultError);
    } finally {
      setProjectJoinRequestsLoading(false);
    }
  }

  const reloadRequestsDebounced = useRef<(searchValue: string, currentPage: number, currentSize: number) => void>();

  useEffect(() => {
    reloadRequestsDebounced.current = debounce((searchValue, currentPage, currentSize) => {
      loadProjectJoinRequests(searchValue, currentPage, currentSize);
    }, 300);
    loadProjectJoinRequests(usernameSearchValue, page, size);
  }, []);

  async function handleJoinRequest(requestId: number, status: RequestStatus) {
    const defaultError = "Failed to update join request status";
    try {
      setProjectJoinRequestsLoading(true);
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/requests/${requestId}`,
        method: "PUT",
        body: {
          status: status
        }
      });
      if (!response?.status || response.status > 404 || !response?.message) {
        return handleErrorNotification(response?.error ?? defaultError);
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? `The status of the selected join request has been updated successfully`
      });
      await loadProjectJoinRequests(usernameSearchValue, page, size);
    } catch (e) {
      handleErrorNotification(defaultError);
    } finally {
      setProjectJoinRequestsLoading(false);
    }
  }

  function handleDeclineClick(requestId: number) {
    dialog.openDialog({
      content: "Do you really wish to decline this project join request?",
      onConfirm: async () => {
        await handleJoinRequest(requestId, RequestStatus.DECLINED);
      }
    });
  }

  async function handleApproveClick(requestId: number) {
    await handleJoinRequest(requestId, RequestStatus.APPROVED);
  }

  const handleJoinRequestSearch = (event: any) => {
    const newSearchValue = event.target.value.toLowerCase().trim();
    setUsernameSearchValue(newSearchValue);
    reloadRequestsDebounced.current?.(newSearchValue, 1, size);
  };

  function handleSizeChange(newPage: number, newSize: number): void {
    reloadRequestsDebounced.current?.(usernameSearchValue, newPage, newSize);
  }

  function handlePageChange(newPage: number): void {
    reloadRequestsDebounced.current?.(usernameSearchValue, newPage, size);
  }

  if (permissionsLoading) {
    return <LoadingSpinner/>;
  } else if (!projectPermissions?.length
    || !projectPermissions.includes(PermissionType.PROJECT_ADMIN)
    || projectJoinRequestError) {
    handleErrorNotification(projectJoinRequestError ?? "Access Denied: Insufficient permissions");
    navigate(`/groups/${groupId}/projects`, {replace: true});
    return <></>;
  }
  return (<Grid container alignItems={"center"} justifyContent={"center"}> <Grid item xs={10}>
    <Card elevation={10}>
      <CardHeader title={"Project Join Requests"} titleTypographyProps={{variant: "h5"}}/>
      <CardContent>
        <Grid container spacing={2} alignItems={"center"} justifyContent={"center"}>
          <Grid item xs={12} md={true}>
            <TextField sx={{width: "100%", padding: 2}} type={"text"} variant={"standard"}
                       value={usernameSearchValue}
                       placeholder={"Search By Username"}
                       onChange={handleJoinRequestSearch}/>
          </Grid>
          <Grid item xs={12} md={"auto"}>
            <URLQueryPagination totalPages={totalPages} defaultPage={1} onPageChange={handlePageChange}
                                onSizeChange={handleSizeChange}/>
          </Grid>
        </Grid>
        {projectJoinRequestsLoading ? <LoadingSpinner/> : !projectJoinRequests?.length
          ? <Typography variant={"body1"}>No project join requests were found.</Typography>
          : <List>{projectJoinRequests.map(request => {
            return <ListItem key={request.requestId}><Card elevation={10} sx={{width: "100%"}}>
              <CardContent><Stack spacing={1}>
                <Typography variant={"h6"}>{request.user?.username}</Typography>
                <Typography>{request.status}</Typography>
                <Stack direction={"row"} spacing={1}>
                  <Button variant={"contained"} onClick={async () => {
                    await handleApproveClick(request.requestId)
                  }}>Approve
                  </Button>
                  <Button color={"error"} variant={"contained"} onClick={() => {
                    handleDeclineClick(request.requestId);
                  }}>Decline
                  </Button>
                </Stack>
              </Stack></CardContent>
            </Card> </ListItem>
          })}
          </List>
        } </CardContent>
      <CardActions>
        <Button onClick={() => {
          navigate(`/groups/${groupId}/projects/${projectId}`)
        }}>
          Back To Dashboard
        </Button>
      </CardActions>
    </Card>
  </Grid>
  </Grid>)
}
