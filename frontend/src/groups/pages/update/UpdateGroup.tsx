import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {useEffect, useState} from "react";
import {GroupCreateRequestDto} from "../../dto/GroupCreateRequestDto.ts";
import {useNavigate, useParams} from "react-router-dom";
import {GroupResponsePrivateDto} from "../../dto/GroupResponsePrivateDto.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {GroupUpdateRequestDto} from "../../dto/GroupUpdateRequestDto.ts";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {PermissionType} from "../../../authentication/dto/PermissionType.ts";
import UpdateGroupForm from "./components/UpdateGroupForm.tsx";
import {isValidId} from "../../../common/utils/isValidId.ts";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";

export default function UpdateGroup() {
  const {loading, groupPermissions} = usePermissions();
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const groupId = useParams()?.groupId;
  const [groupLoading, setGroupLoading] = useState(true);
  const [group, setGroup] = useState<GroupResponsePrivateDto | undefined>(undefined);
  const [groupErrorStatus, setGroupError] = useState<string | undefined>(undefined);

  const handleError = (error?: string) => {
    const defaultError = "An unknown error has occurred, please try again later";
    setGroupError(error ?? defaultError);
    notification.openNotification({
      type: "error",
      vertical: "top",
      horizontal: "center",
      message: error ?? defaultError,
    });
  };

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
        return handleError(response?.error);
      }
      setGroup(response.data as GroupResponsePrivateDto);
    } catch (e) {
      setGroup(undefined);
      setGroupError(`Failed to load group with ID ${groupId}`);
      handleError();
    } finally {
      setGroupLoading(false);
    }
  }

  useEffect(() => {
    loadGroup().then();
  }, []);

  const updateGroup = async (requestDto: GroupCreateRequestDto) => {
    return await authJsonFetch({
      path: `groups/${groupId}`, method: "PUT", body: requestDto
    });
  };

  const handleSubmit = async (event: any) => {
    try {
      setGroupLoading(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;

      const requestDto: GroupUpdateRequestDto = {name, description};
      const response = await updateGroup(requestDto);

      if (!response || response.error || response?.status > 399 || !response.message || !response.data) {
        handleError(response?.error);
        return;
      }
      const addedGroup = response.data as GroupResponsePrivateDto;
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? "Group details updated successfully"
      })
      navigate(`/groups/${addedGroup.groupId}`);
    } catch (e) {
      handleError();
    } finally {
      setGroupLoading(false);
    }
  };
  if (loading || groupLoading) {
    return <LoadingSpinner/>;
  } else if (!groupPermissions?.length
    || !groupPermissions.includes(PermissionType.GROUP_EDITOR)
    || !group) {
    handleError(groupErrorStatus ?? "Access Denied: Insufficient permissions");
    navigate(`/groups/${groupId}`, {replace: true});
    return <></>;
  }
  return <UpdateGroupForm onSubmit={handleSubmit} group={group}/>
}
