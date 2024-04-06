import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
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
  Grid,
  List,
  ListItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";

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

  function handleErrorNotification(message: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: message
    });
  }

  async function loadProjectJoinRequests() {
    const defaultError = `Failed to load project join requests`;
    try {
      setProjectJoinRequestsLoading(true);
      if (!isValidId(groupId) || !isValidId(projectId)) {
        setProjectJoinRequestError("The provided project ID is invalid");
        return;
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/requests`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setProjectJoinRequestError(response?.error ?? defaultError);
        return;
      }
      setProjectJoinRequests(response.data as ProjectJoinRequestResponseDto[]);
    } catch (e) {
      setProjectJoinRequests([]);
      setProjectJoinRequestError(defaultError);
    } finally {
      setProjectJoinRequestsLoading(false);
    }
  }

  useEffect(() => {
    loadProjectJoinRequests().then();
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
      await loadProjectJoinRequests();
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


  const [joinRequestsFilterValue, setJoinRequestsFilterValue] = useState<string>("");

  const joinRequestsFiltered = useMemo(() => {
    if (!projectJoinRequests?.length) {
      return [];
    }
    return projectJoinRequests.filter(request => {
        return request.user.username.toLowerCase().includes(joinRequestsFilterValue)
      }
    );
  }, [projectJoinRequests, joinRequestsFilterValue]);

  const handleJoinRequestSearch = (event: any) => {
    setJoinRequestsFilterValue(event.target.value.toLowerCase().trim());
  };

  if (permissionsLoading || projectJoinRequestsLoading) {
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
        <TextField sx={{width: "100%", padding: 2}} type={"text"} variant={"standard"}
                   value={joinRequestsFilterValue}
                   placeholder={"Search By Username"}
                   onChange={handleJoinRequestSearch}/>
        {projectJoinRequestsLoading ? <LoadingSpinner/> : !joinRequestsFiltered?.length
          ? <Typography variant={"body1"}>No project join requests were found.</Typography>
          : <List>{joinRequestsFiltered.map(request => {
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
