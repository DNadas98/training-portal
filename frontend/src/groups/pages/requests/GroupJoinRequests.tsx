import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {GroupJoinRequestResponseDto} from "../../dto/requests/GroupJoinRequestResponseDto.ts";
import {RequestStatus} from "../../dto/RequestStatus.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
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

export default function GroupJoinRequests() {
  const {loading, groupPermissions} = usePermissions();
  const dialog = useDialog();
  const groupId = useParams()?.groupId;
  const [groupJoinRequestsLoading, setGroupJoinRequestsLoading] = useState(true);
  const [groupJoinRequests, setGroupJoinRequests] = useState<GroupJoinRequestResponseDto[]>([]);
  const [groupJoinRequestError, setGroupJoinRequestError] = useState<string | undefined>(undefined);
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
      if (!isValidId(groupId)) {
        setGroupJoinRequestError("The provided group ID is invalid");
        return;
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/requests`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setGroupJoinRequestError(response?.error ?? defaultError);
        return;
      }
      setGroupJoinRequests(response.data as GroupJoinRequestResponseDto[]);
    } catch (e) {
      setGroupJoinRequests([]);
      setGroupJoinRequestError(defaultError);
    } finally {
      setGroupJoinRequestsLoading(false);
    }
  }

  useEffect(() => {
    loadGroupJoinRequests().then();
  }, []);

  async function handleJoinRequest(requestId: number, status: RequestStatus) {
    const defaultError = "Failed to update join request status";
    try {
      setGroupJoinRequestsLoading(true);
      const response = await authJsonFetch({
        path: `groups/${groupId}/requests/${requestId}`, method: "PUT", body: {
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
      await loadGroupJoinRequests();
    } catch (e) {
      handleErrorNotification(defaultError);
    } finally {
      setGroupJoinRequestsLoading(false);
    }
  }

  function handleDeclineClick(requestId: number) {
    dialog.openDialog({
      text: "Do you really wish to decline this group join request?",
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
    if (!groupJoinRequests?.length) {
      return [];
    }
    return groupJoinRequests.filter(request => {
        return request.user.username.toLowerCase().includes(joinRequestsFilterValue)
      }
    );
  }, [groupJoinRequests, joinRequestsFilterValue]);

  const handleJoinRequestSearch = (event: any) => {
    setJoinRequestsFilterValue(event.target.value.toLowerCase().trim());
  };

  if (loading || groupJoinRequestsLoading) {
    return <LoadingSpinner/>;
  } else if (!groupPermissions?.length || groupJoinRequestError) {
    handleErrorNotification(groupJoinRequestError ?? "Access Denied: Insufficient permissions");
    navigate(`/groups`, {replace: true});
    return <></>;
  }
  return (<Grid container alignItems={"center"} justifyContent={"center"}> <Grid item xs={10}>
    <Card elevation={10}>
      <CardHeader title={"Group Join Requests"} titleTypographyProps={{variant: "h5"}}/>
      <CardContent>
        <TextField sx={{width: "100%", padding: 2}} type={"text"} variant={"standard"}
                   value={joinRequestsFilterValue}
                   placeholder={"Search By Username"}
                   onChange={handleJoinRequestSearch}/>
        {groupJoinRequestsLoading ? <LoadingSpinner/> : !joinRequestsFiltered?.length
          ? <Typography variant={"body1"}>No pending group join requests were found.</Typography>
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
          navigate(`/groups/${groupId}`)
        }}>
          Back To Dashboard
        </Button>
      </CardActions>
    </Card>
  </Grid>
  </Grid>)
}
