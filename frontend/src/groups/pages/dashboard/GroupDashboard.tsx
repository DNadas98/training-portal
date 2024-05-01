import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {GroupResponsePrivateDto} from "../../dto/GroupResponsePrivateDto.ts";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {PermissionType} from "../../../authentication/dto/PermissionType.ts";
import {isValidId} from "../../../common/utils/isValidId.ts";
import {Button, Card, CardActions, CardContent, CardHeader, Grid, Stack} from "@mui/material";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";
import {useAuthentication} from "../../../authentication/hooks/useAuthentication.ts";
import {GlobalRole} from "../../../authentication/dto/userInfo/GlobalRole.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import RichTextDisplay from "../../../common/richTextEditor/RichTextDisplay.tsx";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";

export default function GroupDashboard() {
  const {loading, groupPermissions} = usePermissions();
  const groupId = useParams()?.groupId;
  const [groupLoading, setGroupLoading] = useState(true);
  const [group, setGroup] = useState<GroupResponsePrivateDto | undefined>(undefined);
  const [groupError, setGroupError] = useState<string | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const authentication = useAuthentication();
  const dialog = useDialog();
  const localized = useLocalized();

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
        path: `groups/${groupId}/details`
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

  async function deleteGroup() {
    try {
      setGroupLoading(true);
      if (!isValidId(groupId)) {
        handleErrorNotification("The provided group ID is invalid");
        setGroupLoading(false);
        return
      }
      const response = await authJsonFetch({
        path: `admin/groups/${groupId}`, method: "DELETE"
      });
      if (!response?.status || response.status > 404 || !response?.message) {
        handleErrorNotification(response?.error ?? `Failed to delete group with ID ${groupId}`);
        return;
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: `Group ${group?.name} was deleted successfully`
      });
      navigate("/groups");
    } catch (e) {
      handleErrorNotification(`Failed to delete group with ID ${groupId}`);
    } finally {
      setGroupLoading(false);
    }
  }

  function handleDeleteGroupClick() {
    dialog.openDialog({
      content: "Are you sure you would like to delete this group, along with all group data?",
      confirmText: "Yes, delete the group", onConfirm: () => deleteGroup()
    });
  }

  function handlePreRegisterClick() {
    navigate(`/groups/${groupId}/pre-register`);
  }

  if (loading || groupLoading) {
    return <LoadingSpinner/>;
  } else if (!authentication.getRoles()?.length || !groupPermissions?.length || !group) {
    handleErrorNotification(groupError ?? "Access Denied: Insufficient permissions");
    navigate("/groups", {replace: true});
    return <></>;
  }

  return (
    <Grid container justifyContent={"center"} alignItems={"center"} spacing={2}>
      <Grid item xs={10}><Card>
        <CardHeader title={group.name}/>
        <CardContent>
          <Stack spacing={2}>
            {/*<Typography>{group.description}</Typography>*/}
            <RichTextDisplay content={group.detailedDescription}/>
          </Stack>
        </CardContent>
        <CardActions>
          <Button onClick={handleProjectsClick}>{localized("pages.projects.view_projects")}</Button>
        </CardActions>
      </Card></Grid>
      <Grid item xs={10}>
        <Grid container justifyContent={"space-between"} alignItems={"stretch"} spacing={2}>
          {(groupPermissions.includes(PermissionType.GROUP_EDITOR))
            && <Grid item xs={12} md={true}><Card sx={{minHeight: "100%"}}>
              <CardHeader title={"Group Editor Actions"} titleTypographyProps={{variant: "h6"}}/>
              <CardActions>
                <Button onClick={() => {
                  navigate(`/groups/${groupId}/update`)
                }}>Update group details
                </Button>
              </CardActions>
            </Card></Grid>
          }
          {(groupPermissions.includes(PermissionType.GROUP_ADMIN))
            && <Grid item xs={12} md={true}><Card sx={{minHeight: "100%"}}>
              <CardHeader title={"Group Administrator Actions"} titleTypographyProps={{variant: "h6"}}/>
              <CardActions>
                <Stack spacing={2}>
                  <Button onClick={handleJoinRequestClick} sx={{width:"fit-content"}}>View group join requests</Button>
                  <Button onClick={handlePreRegisterClick} sx={{width:"fit-content"}}>Manage members</Button>
                  {!authentication.getRoles()?.includes(GlobalRole.ADMIN) ? <></> :
                    <Button sx={{width: "fit-content"}} onClick={handleDeleteGroupClick}>Delete Group</Button>
                  }
                </Stack>
              </CardActions>
            </Card></Grid>
          }
        </Grid>
      </Grid>
    </Grid>
  )
}
