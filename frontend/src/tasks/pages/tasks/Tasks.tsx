import TaskBrowser from "./components/TaskBrowser.tsx";
import {FormEvent, useEffect, useMemo, useState} from "react";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
    useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {TaskResponseDto} from "../../dto/TaskResponseDto.ts";
import {ApiResponseDto} from "../../../common/api/dto/ApiResponseDto.ts";

export default function Tasks() {
    const {loading: permissionsLoading, projectPermissions} = usePermissions();
    const groupId = useParams()?.groupId;
    const projectId = useParams()?.projectId;
    const [tasksWithUserLoading, setTasksWithUserLoading] = useState<boolean>(true);
    const [tasksWithUser, setTasksWithUser] = useState<TaskResponseDto[]>([]);
    const [tasksWithoutUserLoading, setTasksWithoutUserLoading] = useState<boolean>(true);
    const [tasksWithoutUser, setTasksWithoutUser] = useState<TaskResponseDto[]>([]);

    const authJsonFetch = useAuthJsonFetch();
    const notification = useNotification();
    const navigate = useNavigate();

    const idIsValid = (id: string | undefined) => {
        return id && !isNaN(parseInt(id)) && parseInt(id) > 0
    };

    function handleErrorNotification(message?: string) {
        notification.openNotification({
            type: "error", vertical: "top", horizontal: "center",
            message: `${message ?? "Failed to load project"}`
        });
    }

    function getTaskData(response: ApiResponseDto) {
        if (!response?.data?.length) {
            return [];
        }
        return response?.data?.map((task) => {
            return {
                ...task,
                startDate: new Date(response.data?.startDate),
                deadline: new Date(response.data?.deadline)
            }
        });
    }

    async function loadTasksWithUser() {
        try {
            const response = await authJsonFetch({
                path: `groups/${groupId}/projects/${projectId}/tasks?withUser=true`
            });
            if (!response?.status || response.status > 399 || !response?.data) {
                handleErrorNotification(`${response?.error ?? "Failed to load your assigned tasks"}`);
                return;
            }
            const taskData: TaskResponseDto[] = getTaskData(response);
            setTasksWithUser(taskData);
        } catch (e) {
            setTasksWithUser([]);
        } finally {
            setTasksWithUserLoading(false);
        }
    }

    async function loadTasksWithoutUser() {
        try {
            const response = await authJsonFetch({
                path: `groups/${groupId}/projects/${projectId}/tasks?withUser=false`
            });
            if (!response?.status || response.status > 399 || !response?.data) {
                handleErrorNotification(`${response?.error ?? "Failed to load tasks to join"}`);
                return;
            }
            const taskData: TaskResponseDto[] = getTaskData(response);
            setTasksWithoutUser(taskData);
        } catch (e) {
            setTasksWithoutUser([]);
        } finally {
            setTasksWithoutUserLoading(false);
        }
    }

    useEffect(() => {
        if (!idIsValid(groupId) || !idIsValid(projectId)) {
            handleErrorNotification("The provided group or project ID is invalid");
            setTasksWithUserLoading(false);
            setTasksWithoutUserLoading(false);
            return;
        } else {
            loadTasksWithUser().then();
            loadTasksWithoutUser().then();
        }
    }, []);

    const [tasksWithUserFilterValue, setTasksWithUserFilterValue] = useState<string>("");
    const [tasksWithoutUserFilterValue, setTasksWithoutUserFilterValue] = useState<string>("");

    const tasksWithUserFiltered = useMemo(() => {
        return tasksWithUser.filter(task => {
                return task.name.toLowerCase().includes(tasksWithUserFilterValue)
            }
        );
    }, [tasksWithUser, tasksWithUserFilterValue]);

    const tasksWithoutUserFiltered = useMemo(() => {
        return tasksWithoutUser.filter(task => {
                return task.name.toLowerCase().includes(tasksWithoutUserFilterValue)
            }
        );
    }, [tasksWithoutUser, tasksWithoutUserFilterValue]);

    const handleTasksWithUserSearch = (event: FormEvent<HTMLInputElement>) => {
        // @ts-ignore
        setTasksWithUserFilterValue(event.target.value.toLowerCase().trim());
    };

    const handleTasksWithoutUserSearch = (event: FormEvent<HTMLInputElement>) => {
        // @ts-ignore
        setTasksWithoutUserFilterValue(event.target.value.toLowerCase().trim());
    };

    const [actionButtonDisabled, setActionButtonDisabled] = useState(false);

    async function assignSelfToTask(taskId: number) {
        try {
            setActionButtonDisabled(true);
            const response = await authJsonFetch({
                path: `groups/${groupId}/projects/${projectId}/tasks/${taskId}/members`,
                method: "POST"
            });
            if (!response?.status || response.status > 399 || !response?.message) {
                handleErrorNotification(`${response?.error ?? "Failed to assign user to selected task"}`);
                return;
            }
            notification.openNotification({
                type: "success", vertical: "top", horizontal: "center",
                message: "You have been assigned to the selected task"
            });
            await loadTasksWithoutUser();
            await loadTasksWithUser();
        } catch (e) {
            handleErrorNotification(`Failed to assign user to selected task`);
        } finally {
            setActionButtonDisabled(false);
        }
    }

    const loadTaskDashboard = (taskId: number) => {
        navigate(`/groups/${groupId}/projects/${projectId}/tasks/${taskId}`);
    }

    const handleAddButtonClick = () => {
        navigate(`/groups/${groupId}/projects/${projectId}/tasks/create`);
    }

    if (permissionsLoading) {
        return <LoadingSpinner/>;
    } else if (!projectPermissions?.length) {
        handleErrorNotification("Access Denied: Insufficient permissions");
        navigate(`/groups/${groupId}/projects`, {replace: true});
        return <></>;
    }

    return (
        <TaskBrowser tasksWithUser={tasksWithUserFiltered}
                     tasksWithUserLoading={tasksWithUserLoading}
                     tasksWithoutUser={tasksWithoutUserFiltered}
                     tasksWithoutUserLoading={tasksWithoutUserLoading}
                     handleTasksWithUserSearch={handleTasksWithUserSearch}
                     handleTasksWithoutUserSearch={handleTasksWithoutUserSearch}
                     handleViewDashboardClick={loadTaskDashboard}
                     handleJoinRequestClick={assignSelfToTask}
                     actionButtonDisabled={actionButtonDisabled}
                     handleAddButtonClick={handleAddButtonClick}/>
    )
}
