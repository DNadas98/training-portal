import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import {FormEvent, useEffect, useState} from "react";
import {TaskCreateRequestDto} from "../../dto/TaskCreateRequestDto.ts";
import {useNavigate, useParams} from "react-router-dom";
import {TaskResponseDto} from "../../dto/TaskResponseDto.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {
  PermissionType
} from "../../../authentication/dto/PermissionType.ts";
import {Importance} from "../../dto/Importance.ts";
import {TaskStatus} from "../../dto/TaskStatus.ts";
import {TaskUpdateRequestDto} from "../../dto/TaskUpdateRequestDto.ts";
import UpdateTaskForm from "./components/UpdateTaskForm.tsx";
import {isValidId} from "../../../common/utils/isValidId.ts";

export default function UpdateTask() {
  const {loading: permissionsLoading, taskPermissions} = usePermissions();
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const taskId = useParams()?.taskId;
  const [taskLoading, setTaskLoading] = useState(true);
  const [task, setTask] = useState<TaskResponseDto | undefined>(undefined);
  const [taskError, setTaskError] = useState<string | undefined>(undefined);

  const handleError = (error?: string) => {
    const defaultError = "An unknown error has occurred, please try again later";
    setTaskError(error ?? defaultError);
    notification.openNotification({
      type: "error",
      vertical: "top",
      horizontal: "center",
      message: error ?? defaultError,
    });
  };

  async function loadTask() {
    try {
      setTaskLoading(true);
      if (!isValidId(groupId) || !isValidId(projectId) || !isValidId(taskId)) {
        setTaskError("The provided group or task ID is invalid");
        setTaskLoading(false);
        return
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/tasks/${taskId}`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        return handleError(response?.error);
      }
      const taskData = {
        ...response.data,
        startDate: new Date(response.data.startDate as string),
        deadline: new Date(response.data.deadline as string)
      }
      setTask(taskData as TaskResponseDto);
    } catch (e) {
      setTask(undefined);
      setTaskError(`Failed to load task`);
      handleError();
    } finally {
      setTaskLoading(false);
    }
  }

  useEffect(() => {
    loadTask().then();
  }, []);

  const updateTask = async (requestDto: TaskCreateRequestDto) => {
    return await authJsonFetch({
      path: `groups/${groupId}/projects/${projectId}/tasks/${taskId}`,
      method: "PUT",
      body: requestDto
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      setTaskLoading(true);
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;
      const startDate = new Date(formData.get("startDate") as string).toISOString();
      const deadline = new Date(formData.get("deadline") as string).toISOString();
      const importance = (formData.get("importance") as Importance);
      const taskStatus = (formData.get("taskStatus") as TaskStatus);
      const difficulty = Number(formData.get("difficulty"));

      const requestDto: TaskUpdateRequestDto = {
        name,
        description,
        startDate,
        deadline,
        importance,
        taskStatus,
        difficulty
      };
      const response = await updateTask(requestDto);

      if (!response || response.error || response?.status > 399 || !response.data) {
        handleError(response?.error);
        return;
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? "Task details updated successfully"
      });
      navigate(`/groups/${groupId}/projects/${projectId}/tasks/${taskId}`);
    } catch (e) {
      handleError();
    } finally {
      setTaskLoading(false);
    }
  };
  if (permissionsLoading || taskLoading) {
    return <LoadingSpinner/>;
  } else if (!taskPermissions?.length
    || !taskPermissions.includes(PermissionType.TASK_ASSIGNED_MEMBER)
    || !task) {
    handleError(taskError ?? "Access Denied: Insufficient permissions");
    navigate(`/groups/${groupId}/projects/${projectId}/tasks`, {replace: true});
    return <></>;
  }
  return <UpdateTaskForm onSubmit={handleSubmit}
                         name={task.name}
                         description={task.description}
                         startDate={task.startDate}
                         deadline={task.deadline}
                         difficulty={task.difficulty}
                         taskImportance={task.importance}
                         taskStatus={task.taskStatus}
                         statuses={[TaskStatus.BACKLOG,
                           TaskStatus.IN_PROGRESS,
                           TaskStatus.DONE,
                           TaskStatus.FAILED]}
                         importances={[Importance.MUST_HAVE, Importance.NICE_TO_HAVE]}
                         minDifficulty={1}
                         maxDifficulty={5}/>
}
