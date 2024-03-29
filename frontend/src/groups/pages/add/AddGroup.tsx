import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import AddGroupForm from "./components/AddGroupForm.tsx";
import {useState} from "react";
import {GroupCreateRequestDto} from "../../dto/GroupCreateRequestDto.ts";
import {useNavigate} from "react-router-dom";
import {GroupResponsePrivateDto} from "../../dto/GroupResponsePrivateDto.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";
import {GlobalRole} from "../../../authentication/dto/userInfo/GlobalRole.ts";
import {useAuthentication} from "../../../authentication/hooks/useAuthentication.ts";

export default function AddGroup() {
  const authentication = useAuthentication();
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const addGroup = async (requestDto: GroupCreateRequestDto) => {
    return await authJsonFetch({
      path: "admin/groups", method: "POST", body: requestDto
    });
  };

  const handleError = (error: string) => {
    notification.openNotification({
      type: "error",
      vertical: "top",
      horizontal: "center",
      message: error,
    });
  };

  const handleSubmit = async (event: any) => {
    try {
      setLoading(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const detailedDescription = formData.get('detailedDescription') as string;
      if (!detailedDescription?.length) {
        handleError("A detailed description of the group is required to proceed");
        return;
      }
      if (detailedDescription.length > 10000) {
        handleError("Detailed description must be shorter than 10000 characters");
        return;
      }

      const requestDto: GroupCreateRequestDto = {name, description, detailedDescription};
      const response = await addGroup(requestDto);

      if (!response || response.error || response?.status > 399 || !response.message || !response.data) {
        handleError(response?.error ?? "An unknown error has occurred, please try again later");
        return;
      }
      const addedGroup = response.data as GroupResponsePrivateDto;

      navigate(`/groups/${addedGroup.groupId}`);
    } catch (e) {
      handleError("An unknown error has occurred, please try again later!");
    } finally {
      setLoading(false);
    }
  };

  if (!authentication.getRoles()?.includes(GlobalRole.ADMIN)) {
    navigate(-1);
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: "Access Denied: Insufficient Permissions"
    });
    return <></>
  }

  return (loading
      ? <LoadingSpinner/>
      : <AddGroupForm onSubmit={handleSubmit}/>
  )
}
