import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {PermissionType} from "../../../authentication/dto/PermissionType.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {TaskResponseDto} from "../../dto/TaskResponseDto.ts";
import {isValidId} from "../../../common/utils/isValidId.ts";
import useAuthJsonFetch from "../../../common/api/hooks/useAuthJsonFetch.tsx";

export default function TaskDashboard() {
  const {loading: permissionsLoading, projectPermissions, taskPermissions} = usePermissions();
  const dialog = useDialog();
  const groupId = useParams()?.groupId;
  const projectId = useParams()?.projectId;
  const taskId = useParams()?.taskId;
  const [taskLoading, setTaskLoading] = useState(true);
  const [task, setTask] = useState<TaskResponseDto | undefined>(undefined);
  const [taskError, setTaskError] = useState<string | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();

  function handleErrorNotification(message?: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: `${message ?? "Failed to load task"}`
    });
  }

  async function loadTask() {
    try {
      setTaskLoading(true);
      if (!isValidId(groupId) || !isValidId(projectId) || !isValidId(taskId)) {
        setTaskError("The provided group, project or task ID is invalid");
        setTaskLoading(false);
        return
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/tasks/${taskId}`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setTaskError(response?.error ?? `Failed to load task`);
        return handleErrorNotification(response?.error);
      }
      const taskData = {
        ...response.data,
        startDate: new Date(response.data.startDate as string),
        deadline: new Date(response.data.deadline as string),
      }
      setTask(taskData as TaskResponseDto);
    } catch (e) {
      setTask(undefined);
      setTaskError("Failed to load task");
      handleErrorNotification();
    } finally {
      setTaskLoading(false);
    }
  }

  useEffect(() => {
    loadTask().then();
  }, []);

  async function deleteTask() {
    try {
      setTaskLoading(true);
      if (!isValidId(taskId)) {
        setTaskError("The provided group or task ID is invalid");
        setTaskLoading(false);
        return
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/projects/${projectId}/tasks/${taskId}`,
        method: "DELETE"
      });
      if (!response?.status || response.status > 404 || !response?.message) {
        return handleErrorNotification(response?.error ?? "Failed to remove task data");
      }

      setTask(undefined);
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? "All task data has been removed successfully"
      });
      navigate(`/groups/${groupId}/projects/${projectId}/tasks`, {replace: true});
    } catch (e) {
      handleErrorNotification("Failed to remove task data");
    } finally {
      setTaskLoading(false);
    }
  }

  function handleDeleteClick() {
    dialog.openDialog({
      content: "Do you really wish to remove all task data?",
      confirmText: "Yes, delete this task", onConfirm: deleteTask
    });
  }

  async function removeSelfFromTask() {
    const response = await authJsonFetch({
      path: `groups/${groupId}/projects/${projectId}/tasks/${taskId}/members`,
      method: "DELETE"
    });
    if (!response?.message || !response?.status || response?.status > 399) {
      handleErrorNotification(response?.error ?? "Failed to remove your assignment to this task");
      return;
    }
    notification.openNotification({
      type: "success", vertical: "top", horizontal: "center",
      message: response.message
    });
    navigate(`/groups/${groupId}/projects/${projectId}/tasks`);
  }

  function handleRemoveSelfClick() {
    dialog.openDialog({
      content: "Do you really want to remove your assignment to this task?",
      onConfirm: removeSelfFromTask
    });
  }

  if (permissionsLoading || taskLoading) {
    return <LoadingSpinner/>;
  } else if (!projectPermissions?.length || !task) {
    handleErrorNotification(taskError ?? "Access Denied: Insufficient permissions");
    navigate(`/groups/${groupId}/projects`, {replace: true});
    return <></>;
  }
  return (
    <div>
      <h1>{task.name}</h1>
      <p>{task.description}</p>
      <p>Importance: {task.importance}</p>
      <p>Status: {task.taskStatus}</p>
      <p>Difficulty: {task.difficulty}</p>
      <p>Start date: {task.startDate.toString()}</p>
      <p>Deadline: {task.deadline.toString()}</p>
      <p>Task Permissions: {taskPermissions.join(", ")}</p>
      <br/>
      {(taskPermissions.includes(PermissionType.TASK_ASSIGNED_MEMBER))
        && <div>
          <button onClick={() => {
            navigate(`/groups/${groupId}/projects/${projectId}/tasks/${taskId}/update`);
          }}>Update task details
          </button>
          <br/>
          <button onClick={handleRemoveSelfClick}>Remove assignment to task</button>
          <br/>
          <button onClick={handleDeleteClick}>Remove task</button>
        </div>
      }
      <button
        onClick={() => navigate(`/groups/${groupId}/projects/${projectId}/tasks`)}>Back
      </button>
    </div>
  )
}
