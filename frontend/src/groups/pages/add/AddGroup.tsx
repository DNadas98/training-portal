import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import AddGroupForm from "./components/AddGroupForm.tsx";
import {FormEvent, useState} from "react";
import {GroupCreateRequestDto} from "../../dto/GroupCreateRequestDto.ts";
import {useNavigate} from "react-router-dom";
import {GroupResponsePrivateDto} from "../../dto/GroupResponsePrivateDto.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";

export default function AddGroup() {
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const addGroup = async (requestDto: GroupCreateRequestDto) => {
    return await authJsonFetch({
      path: "groups", method: "POST", body: requestDto
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      event.preventDefault();
      // @ts-ignore
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;

      const requestDto: GroupCreateRequestDto = {name, description};
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

  return (loading
      ? <LoadingSpinner/>
      : <AddGroupForm onSubmit={handleSubmit}/>
  )
}
