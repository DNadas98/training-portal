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
    handleErrorNotification(error ?? defaultError);
  };
  const handleErrorNotification = (message: string) => {
    notification.openNotification({
      type: "error",
      vertical: "top",
      horizontal: "center",
      message: message,
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
      const detailedDescription = formData.get('detailedDescription') as string;
      if (!detailedDescription?.length) {
        handleErrorNotification("A detailed description of the group is required to proceed");
        return;
      }
      if (detailedDescription.length > 10000) {
        handleErrorNotification("Detailed description must be shorter than 10000 characters");
        return;
      }

      const requestDto: GroupUpdateRequestDto = {name, description, detailedDescription};
      const response = await updateGroup(requestDto);

      if (!response || response.error || response?.status > 399 || !response.message || !response.data) {
        handleErrorNotification(response?.error ?? "Failed to update group");
        return;
      }
      const addedGroup = response.data as GroupResponsePrivateDto;
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? "Group details updated successfully"
      })
      navigate(`/groups/${addedGroup.groupId}`);
    } catch (e) {
      handleErrorNotification("Failed to update group");
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
