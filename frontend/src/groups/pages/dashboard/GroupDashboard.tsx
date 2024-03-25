import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {GroupResponsePrivateDto} from "../../dto/GroupResponsePrivateDto.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {
  PermissionType
} from "../../../authentication/dto/PermissionType.ts";
import {isValidId} from "../../../common/utils/isValidId.ts";
import {Button, Card, CardActions, CardContent, CardHeader, Grid, Typography} from "@mui/material";

export default function GroupDashboard() {
  const {loading, groupPermissions} = usePermissions();
  const groupId = useParams()?.groupId;
  const [groupLoading, setGroupLoading] = useState(true);
  const [group, setGroup] = useState<GroupResponsePrivateDto | undefined>(undefined);
  const [groupErrorStatus, setGroupError] = useState<string | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();

  function handleErrorNotification(message?: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: `${message ?? `Failed to load group with ID ${groupId}`}`
    });
  }

  async function loadGroup() {
    try {
      setGroupLoading(true);
      if (!isValidId(groupId)) {
        setGroupError("The provided group ID is invalid");
        setGroupLoading(false);
        return
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setGroupError(response?.error ?? `Failed to load group with ID ${groupId}`);
        return handleErrorNotification(response?.error);
      }
      setGroup(response.data as GroupResponsePrivateDto);
    } catch (e) {
      setGroup(undefined);
      setGroupError(`Failed to load group with ID ${groupId}`);
      handleErrorNotification();
    } finally {
      setGroupLoading(false);
    }
  }

  useEffect(() => {
    loadGroup().then();
  }, []);

  function handleJoinRequestClick() {
    navigate(`/groups/${groupId}/requests`);
  }

  function handleProjectsClick() {
    navigate(`/groups/${groupId}/projects`);
  }

  if (loading || groupLoading) {
    return <LoadingSpinner/>;
  } else if (!groupPermissions?.length || !group) {
    handleErrorNotification(groupErrorStatus ?? "Access Denied: Insufficient permissions");
    navigate("/groups", {replace: true});
    return <></>;
  }
  return (
    <Grid container justifyContent={"center"} alignItems={"center"} spacing={2}>
      <Grid item xs={10}><Card>
        <CardHeader title={group.name}/>
        <CardContent>
          <Typography>{group.description}</Typography>
        </CardContent>
        <CardActions>
          <Button onClick={handleProjectsClick}>View projects</Button>
        </CardActions>
      </Card></Grid>
      {(groupPermissions.includes(PermissionType.GROUP_EDITOR))
        && <Grid item xs={10}><Card>
          <CardHeader title={"Company Editor Actions"} titleTypographyProps={{variant: "h6"}}/>
          <CardActions>
            <Button onClick={() => {
              navigate(`/groups/${groupId}/update`)
            }}>Update group details
            </Button>
          </CardActions>
        </Card></Grid>
      }
      {(groupPermissions.includes(PermissionType.GROUP_ADMIN))
        &&
        <Grid item xs={10}><Card>
          <CardHeader title={"Company Administrator Actions"} titleTypographyProps={{variant: "h6"}}/>
          <CardActions>
            <Button onClick={handleJoinRequestClick}>View group join requests</Button>
          </CardActions>
        </Card></Grid>
      }
    </Grid>
  )
}
