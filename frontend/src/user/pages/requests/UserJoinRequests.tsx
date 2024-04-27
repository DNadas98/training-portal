import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {GroupJoinRequestResponseDto} from "../../../groups/dto/requests/GroupJoinRequestResponseDto.ts";
import {ProjectJoinRequestResponseDto} from "../../../projects/dto/requests/ProjectJoinRequestResponseDto.ts";
import {Button, Card, CardContent, CardHeader, Grid, List, ListItem, Stack, Typography} from "@mui/material";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";

export default function UserJoinRequests() {
  const dialog = useDialog();
  const [groupJoinRequestsLoading, setGroupJoinRequestsLoading] = useState(true);
  const [groupJoinRequests, setGroupJoinRequests] = useState<GroupJoinRequestResponseDto[]>([]);
  const [projectJoinRequestsLoading, setProjectJoinRequestsLoading] = useState(true);
  const [projectJoinRequests, setProjectJoinRequests] = useState<ProjectJoinRequestResponseDto[]>([]);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const localized = useLocalized();

  function handleErrorNotification(message: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: message
    });
  }

  async function loadGroupJoinRequests() {
    const defaultError = localized("pages.user.requests.error.group_default");
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
    const defaultError = localized("pages.user.requests.error.project_default");
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
    const defaultError = localized("pages.user.requests.error.group_delete_default");
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
    const defaultError = localized("pages.user.requests.error.project_delete_default");
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
      content: localized("pages.user.requests.group_delete_confirm"),
      onConfirm: async () => {
        await deleteGroupJoinRequest(requestId);
      }
    });
  }

  function handleProjectJoinRequestDeleteClick(requestId: number) {
    dialog.openDialog({
      content: localized("pages.user.requests.project_delete_confirm"),
      onConfirm: async () => {
        await deleteProjectJoinRequest(requestId);
      }
    });
  }

  return (<Grid container alignItems={"center"} justifyContent={"center"}> <Grid item xs={10}> <Stack spacing={2}>
    <Card elevation={10}>
      <CardHeader title={localized("pages.user.requests.group_title")} titleTypographyProps={{variant: "h5"}}/>
      <CardContent>{groupJoinRequestsLoading ? <LoadingSpinner/> : !groupJoinRequests?.length
        ? <Typography variant={"body1"}>{localized("pages.user.requests.group_not_found")}</Typography>
        : <List>{groupJoinRequests.map(request => {
          return <ListItem key={request.requestId}><Card elevation={10} sx={{width: "100%"}}>
            <CardContent><Stack spacing={1}>
              <Typography variant={"h6"}>{request.group?.name}</Typography>
              <Typography>Request Status: {request.status}</Typography>
              <Button sx={{maxWidth: "fit-content"}} color={"error"} variant={"contained"} onClick={async () => {
                handleGroupJoinRequestDeleteClick(request.requestId);
              }}>
                {localized("common.remove")}
              </Button>
            </Stack></CardContent>
          </Card> </ListItem>
        })}
        </List>
      } </CardContent>
    </Card>
    <Card elevation={10}>
      <CardHeader title={localized("pages.user.requests.project_title")} titleTypographyProps={{variant: "h5"}}/>
      <CardContent>{projectJoinRequestsLoading ? <LoadingSpinner/> : !projectJoinRequests?.length
        ? <Typography variant={"body1"}>{localized("pages.user.requests.project_not_found")}</Typography>
        : <List>{projectJoinRequests.map(request => {
          return <ListItem key={request.requestId}><Card elevation={10} sx={{width: "100%"}}>
            <CardContent><Stack spacing={1}>
              <Typography variant={"h6"}>{request.project?.name}</Typography>
              <Typography>Request Status: {request.status}</Typography>
              <Button sx={{maxWidth: "fit-content"}} color={"error"} variant={"contained"} onClick={async () => {
                handleProjectJoinRequestDeleteClick(request.requestId);
              }}>
                {localized("common.remove")}
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
            {localized("menus.groups")}
          </Button>
          <Button onClick={() => {
            navigate("/user")
          }}>
            {localized("menus.profile")}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  </Stack> </Grid> </Grid>)
}
