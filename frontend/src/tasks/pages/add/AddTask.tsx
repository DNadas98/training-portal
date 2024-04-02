import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import AddTaskForm from "./components/AddTaskForm.tsx";
import {FormEvent, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {TaskResponseDto} from "../../dto/TaskResponseDto.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {TaskStatus} from "../../dto/TaskStatus.ts";
import {Importance} from "../../dto/Importance.ts";
import {TaskCreateRequestDto} from "../../dto/TaskCreateRequestDto.ts";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";
import useSubmittedDate from "../../../common/dateTime/useSubmittedDate.tsx";

export default function AddTask() {
  const {loading: permissionsLoading, projectPermissions} = usePermissions();
  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const toSubmittedDate = useSubmittedDate();
  const addTask = async (requestDto: TaskCreateRequestDto) => {
    return await authJsonFetch({
      path: `groups/${groupId}/projects/${projectId}/tasks`,
      method: "POST",
      body: requestDto
    });
  };

  const handleError = (error: string) => {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center", message: error,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const startDate = toSubmittedDate(formData.get("startDate") as string);
      const deadline = toSubmittedDate(formData.get("deadline") as string);
      const importance = (formData.get("importance") as Importance);
      const taskStatus = (formData.get("taskStatus") as TaskStatus);
      const difficulty = Number(formData.get("difficulty"));
      const requestDto: TaskCreateRequestDto = {
        name,
        description,
        startDate,
        deadline,
        importance,
        taskStatus,
        difficulty
      };
      const response = await addTask(requestDto);

      if (!response || response.error || response?.status > 399 || !response.message || !response.data) {
        handleError(response?.error ?? "An unknown error has occurred, please try again later");
        return;
      }
      const addedTask = response.data as TaskResponseDto;

      navigate(`/groups/${groupId}/projects/${projectId}/tasks/${addedTask.taskId}`);
    } catch (e) {
      handleError("An unknown error has occurred, please try again later!");
    } finally {
      setLoading(false);
    }
  };

  if (permissionsLoading) {
    return <LoadingSpinner/>;
  } else if (!projectPermissions?.length) {
    handleError("Access Denied: Insufficient permissions");
    navigate(`/groups/${groupId}/projects`, {replace: true});
    return <></>;
  }

  return (loading
      ? <LoadingSpinner/>
      : <AddTaskForm onSubmit={handleSubmit}
                     statuses={[TaskStatus.BACKLOG,
                       TaskStatus.IN_PROGRESS,
                       TaskStatus.DONE,
                       TaskStatus.FAILED]}
                     importances={[Importance.MUST_HAVE, Importance.NICE_TO_HAVE]}
                     minDifficulty={1}
                     maxDifficulty={5}/>
  )
}
