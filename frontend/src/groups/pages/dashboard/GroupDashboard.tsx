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
} from "../../../authentication/dto/applicationUser/PermissionType.ts";

export default function GroupDashboard() {
  const {loading, groupPermissions} = usePermissions();
  const groupId = useParams()?.groupId;
  const [groupLoading, setGroupLoading] = useState(true);
  const [group, setGroup] = useState<GroupResponsePrivateDto | undefined>(undefined);
  const [groupErrorStatus, setGroupError] = useState<string | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();

  const idIsValid = groupId && !isNaN(parseInt(groupId)) && parseInt(groupId) > 0;

  function handleErrorNotification(message?: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: `${message ?? `Failed to load group with ID ${groupId}`}`
    });
  }

  async function loadGroup() {
    try {
      setGroupLoading(true);
      if (!idIsValid) {
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
    <div>
      <h1>{group.name}</h1>
      <p>{group.description}</p>
      <p>Permissions: {groupPermissions.join(", ")}</p>
      <button onClick={handleProjectsClick}>View projects</button>
      {(groupPermissions.includes(PermissionType.GROUP_EDITOR))
        && <div>
              <button onClick={() => {
                navigate(`/groups/${groupId}/update`)
              }}>Update group details
              </button>
          </div>
      }
      {(groupPermissions.includes(PermissionType.GROUP_ADMIN))
        && <div>
              <button onClick={handleJoinRequestClick}>View group join requests</button>
          </div>
      }
    </div>
  )
}
