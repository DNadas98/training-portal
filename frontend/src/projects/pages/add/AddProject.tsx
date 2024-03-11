import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import AddProjectForm from "./components/AddProjectForm.tsx";
import {FormEvent, useState} from "react";
import {ProjectCreateRequestDto} from "../../dto/ProjectCreateRequestDto.ts";
import {useNavigate, useParams} from "react-router-dom";
import {ProjectResponsePrivateDto} from "../../dto/ProjectResponsePrivateDto.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {PermissionType} from "../../../authentication/dto/applicationUser/PermissionType.ts";

export default function AddProject() {
    const {loading: permissionsLoading, groupPermissions} = usePermissions();
    const groupId = useParams()?.groupId;
    const authJsonFetch = useAuthJsonFetch();
    const notification = useNotification();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const addProject = async (requestDto: ProjectCreateRequestDto) => {
        return await authJsonFetch({
            path: `groups/${groupId}/projects`, method: "POST", body: requestDto
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
            const formData = new FormData(event.currentTarget);
            const name = formData.get('name') as string;
            const description = formData.get('description') as string;
            const startDate = new Date(formData.get("startDate") as string).toISOString();
            const deadline = new Date(formData.get("deadline") as string).toISOString();

            const requestDto: ProjectCreateRequestDto = {name, description, startDate, deadline};
            const response = await addProject(requestDto);

            if (!response || response.error || response?.status > 399 || !response.message || !response.data) {
                handleError(response?.error ?? "An unknown error has occurred, please try again later");
                return;
            }
            const addedProject = response.data as ProjectResponsePrivateDto;

            navigate(`/groups/${groupId}/projects/${addedProject.projectId}`);
        } catch (e) {
            handleError("An unknown error has occurred, please try again later!");
        } finally {
            setLoading(false);
        }
    };

    if (permissionsLoading) {
        return <LoadingSpinner/>;
    } else if (!groupPermissions?.length
        || !groupPermissions.includes(PermissionType.GROUP_ADMIN)) {
        notification.openNotification({
            type: "error", vertical: "top", horizontal: "center",
            message: "Access Denied: Insufficient permissions"
        });
        navigate(`/groups`, {replace: true});
        return <></>;
    }

    return (loading
            ? <LoadingSpinner/>
            : <AddProjectForm onSubmit={handleSubmit}/>
    )
}
