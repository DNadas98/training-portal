import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {GroupJoinRequestResponseDto} from "../../../groups/dto/requests/GroupJoinRequestResponseDto.ts";
import {ProjectJoinRequestResponseDto} from "../../../projects/dto/requests/ProjectJoinRequestResponseDto.ts";
import {Button, Card, CardContent, CardHeader, Grid, List, ListItem, Stack, Typography} from "@mui/material";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";

export default function UserJoinRequests() {
  const dialog = useDialog();
  const [groupJoinRequestsLoading, setGroupJoinRequestsLoading] = useState(true);
  const [groupJoinRequests, setGroupJoinRequests] = useState<GroupJoinRequestResponseDto[]>([]);
  const [projectJoinRequestsLoading, setProjectJoinRequestsLoading] = useState(true);
  const [projectJoinRequests, setProjectJoinRequests] = useState<ProjectJoinRequestResponseDto[]>([]);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();

  function handleErrorNotification(message: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: message
    });
  }

  async function loadGroupJoinRequests() {
    const defaultError = `Failed to load group join requests`;
    try {
      setGroupJoinRequestsLoading(true);
      const response = await authJsonFetch({
        path: `user/group-requests`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        handleErrorNotification(response?.error ?? defaultError);
        return;
      }
      setGroupJoinRequests(response.data as GroupJoinRequestResponseDto[]);
    } catch (e) {
      setGroupJoinRequests([]);
      handleErrorNotification(defaultError);
    } finally {
      setGroupJoinRequestsLoading(false);
    }
  }

  async function loadProjectJoinRequests() {
    const defaultError = `Failed to load project join requests`;
    try {
      setProjectJoinRequestsLoading(true);
      const response = await authJsonFetch({
        path: `user/project-requests`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        handleErrorNotification(response?.error ?? defaultError);
        return;
      }
      setProjectJoinRequests(response.data as ProjectJoinRequestResponseDto[]);
    } catch (e) {
      setProjectJoinRequests([]);
      handleErrorNotification(defaultError);
    } finally {
      setProjectJoinRequestsLoading(false);
    }
  }

  useEffect(() => {
    loadGroupJoinRequests().then();
    loadProjectJoinRequests().then();
  }, []);

  async function deleteGroupJoinRequest(requestId: number) {
    const defaultError = "Failed to delete group join request";
    try {
      setGroupJoinRequestsLoading(true);
      const response = await authJsonFetch({
        path: `user/group-requests/${requestId}`, method: "DELETE"
      });
      if (!response?.status || response.status > 404 || !response?.message) {
        return handleErrorNotification(response?.error ?? defaultError);
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message
      });
      await loadGroupJoinRequests();
    } catch (e) {
      handleErrorNotification(defaultError);
    } finally {
      setGroupJoinRequestsLoading(false);
    }
  }

  async function deleteProjectJoinRequest(requestId: number) {
    const defaultError = "Failed to delete project join request";
    try {
      setProjectJoinRequestsLoading(true);
      const response = await authJsonFetch({
        path: `user/project-requests/${requestId}`, method: "DELETE"
      });
      if (!response?.status || response.status > 404 || !response?.message) {
        return handleErrorNotification(response?.error ?? defaultError);
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message
      });
      await loadProjectJoinRequests();
    } catch (e) {
      handleErrorNotification(defaultError);
    } finally {
      setProjectJoinRequestsLoading(false);
    }
  }

  function handleGroupJoinRequestDeleteClick(requestId: number) {
    dialog.openDialog({
      content: "Do you really wish to delete this group join request?",
      onConfirm: async () => {
        await deleteGroupJoinRequest(requestId);
      }
    });
  }

  function handleProjectJoinRequestDeleteClick(requestId: number) {
    dialog.openDialog({
      content: "Do you really wish to delete this project join request?",
      onConfirm: async () => {
        await deleteProjectJoinRequest(requestId);
      }
    });
  }

  return (<Grid container alignItems={"center"} justifyContent={"center"}> <Grid item xs={10}> <Stack spacing={2}>
    <Card elevation={10}>
      <CardHeader title={"Group Join Requests"} titleTypographyProps={{variant: "h5"}}/>
      <CardContent>{groupJoinRequestsLoading ? <LoadingSpinner/> : !groupJoinRequests?.length
        ? <Typography variant={"body1"}>No pending group join requests were found.</Typography>
        : <List>{groupJoinRequests.map(request => {
          return <ListItem key={request.requestId}><Card elevation={10} sx={{width: "100%"}}>
            <CardContent><Stack spacing={1}>
              <Typography variant={"h6"}>{request.group?.name}</Typography>
              <Typography>Request Status: {request.status}</Typography>
              <Button sx={{maxWidth: "fit-content"}} color={"error"} variant={"contained"} onClick={async () => {
                handleGroupJoinRequestDeleteClick(request.requestId);
              }}>
                Remove
              </Button>
            </Stack></CardContent>
          </Card> </ListItem>
        })}
        </List>
      } </CardContent>
    </Card>
    <Card elevation={10}>
      <CardHeader title={"Project Join Requests"} titleTypographyProps={{variant: "h5"}}/>
      <CardContent>{projectJoinRequestsLoading ? <LoadingSpinner/> : !projectJoinRequests?.length
        ? <Typography variant={"body1"}>No pending project join requests were found.</Typography>
        : <List>{projectJoinRequests.map(request => {
          return <ListItem key={request.requestId}><Card elevation={10} sx={{width: "100%"}}>
            <CardContent><Stack spacing={1}>
              <Typography variant={"h6"}>{request.project?.name}</Typography>
              <Typography>Request Status: {request.status}</Typography>
              <Button sx={{maxWidth: "fit-content"}} color={"error"} variant={"contained"} onClick={async () => {
                handleProjectJoinRequestDeleteClick(request.requestId);
              }}>
                Remove
              </Button>
            </Stack></CardContent>
          </Card></ListItem>
        })}
        </List>
      } </CardContent>
    </Card>
    <Card elevation={10}>
      <CardContent>
        <Stack direction={"row"} spacing={2}>
          <Button onClick={() => {
            navigate("/groups")
          }}>
            Groups
          </Button>
          <Button onClick={() => {
            navigate("/user")
          }}>
            Profile
          </Button>
        </Stack>
      </CardContent>
    </Card>
  </Stack> </Grid> </Grid>)
}
