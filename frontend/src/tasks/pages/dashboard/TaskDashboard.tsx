import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {
  PermissionType
} from "../../../authentication/dto/applicationUser/PermissionType.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {TaskResponseDto} from "../../dto/TaskResponseDto.ts";

export default function TaskDashboard() {
  const {loading: permissionsLoading,projectPermissions, taskPermissions} = usePermissions();
  const dialog = useDialog();
  const companyId = useParams()?.companyId;
  const projectId = useParams()?.projectId;
  const taskId = useParams()?.taskId;
  const [taskLoading, setTaskLoading] = useState(true);
  const [task, setTask] = useState<TaskResponseDto | undefined>(undefined);
  const [taskError, setTaskError] = useState<string | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();

  const idIsValid = (id: string | undefined) => {
    return id && !isNaN(parseInt(id)) && parseInt(id) > 0
  };

  function handleErrorNotification(message?: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: `${message ?? "Failed to load task"}`
    });
  }

  async function loadTask() {
    try {
      setTaskLoading(true);
      if (!idIsValid(companyId) || !idIsValid(projectId) || !idIsValid(taskId)) {
        setTaskError("The provided company, project or task ID is invalid");
        setTaskLoading(false);
        return
      }
      const response = await authJsonFetch({
        path: `companies/${companyId}/projects/${projectId}/tasks/${taskId}`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setTaskError(response?.error ?? `Failed to load task`);
        return handleErrorNotification(response?.error);
      }
      const taskData = {
        ...response.data,
        startDate: new Date(response.data?.startDate),
        deadline: new Date(response.data?.deadline),
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
      if (!idIsValid) {
        setTaskError("The provided company or task ID is invalid");
        setTaskLoading(false);
        return
      }
      const response = await authJsonFetch({
        path: `companies/${companyId}/projects/${projectId}/tasks/${taskId}`,
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
      navigate(`/companies/${companyId}/projects/${projectId}/tasks`, {replace: true});
    } catch (e) {
      handleErrorNotification("Failed to remove task data");
    } finally {
      setTaskLoading(false);
    }
  }

  function handleDeleteClick() {
    dialog.openDialog({
      text: "Do you really wish to remove all task data, including all expenses?",
      confirmText: "Yes, delete this task", onConfirm: deleteTask
    });
  }

  async function removeSelfFromTask() {
    const response = await authJsonFetch({
      path: `companies/${companyId}/projects/${projectId}/tasks/${taskId}/employees`,
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
    navigate(`/companies/${companyId}/projects/${projectId}/tasks`);
  }

  function handleRemoveSelfClick() {
    dialog.openDialog({
      text: "Do you really want to remove your assignment to this task?",
      onConfirm: removeSelfFromTask
    });
  }

  function handleExpensesClick() {
    navigate(`/companies/${companyId}/projects/${projectId}/tasks/${taskId}/expenses`);
  }

  if (permissionsLoading || taskLoading) {
    return <LoadingSpinner/>;
  } else if (!projectPermissions?.length || !task) {
    handleErrorNotification(taskError ?? "Access Denied: Insufficient permissions");
    navigate(`/companies/${companyId}/projects`, {replace: true});
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
      <button onClick={handleExpensesClick}>View expenses</button>
      <br/>
      {(taskPermissions.includes(PermissionType.TASK_ASSIGNED_EMPLOYEE))
        && <div>
              <button onClick={() => {
                navigate(`/companies/${companyId}/projects/${projectId}/tasks/${taskId}/update`);
              }}>Update task details
              </button>
              <br/>
              <button onClick={handleRemoveSelfClick}>Remove assignment to task</button>
              <br/>
              <button onClick={handleDeleteClick}>Remove task</button>
          </div>
      }
      <button
        onClick={() => navigate(`/companies/${companyId}/projects/${projectId}/tasks`)}>Back
      </button>
    </div>
  )
}
