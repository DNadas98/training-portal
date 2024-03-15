import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {ProjectJoinRequestResponseDto} from "../../dto/requests/ProjectJoinRequestResponseDto.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {RequestStatus} from "../../../groups/dto/RequestStatus.ts";
import {PermissionType} from "../../../authentication/dto/PermissionType.ts";
import {isValidId} from "../../../common/utils/isValidId.ts";

export default function ProjectJoinRequests() {
    const {loading: permissionsLoading, projectPermissions} = usePermissions();
    const dialog = useDialog();
    const groupId = useParams()?.groupId;
    const projectId = useParams()?.projectId;
    const [projectJoinRequestsLoading, setProjectJoinRequestsLoading] = useState(true);
    const [projectJoinRequests, setProjectJoinRequests] = useState<ProjectJoinRequestResponseDto[]>([]);
    const [projectJoinRequestError, setProjectJoinRequestError] = useState<string | undefined>(undefined);
    const authJsonFetch = useAuthJsonFetch();
    const notification = useNotification();
    const navigate = useNavigate();

    function handleErrorNotification(message: string) {
        notification.openNotification({
            type: "error", vertical: "top", horizontal: "center",
            message: message
        });
    }

    async function loadProjectJoinRequests() {
        const defaultError = `Failed to load project join requests`;
        try {
            setProjectJoinRequestsLoading(true);
            if (!isValidId(groupId) || !isValidId(projectId)) {
                setProjectJoinRequestError("The provided project ID is invalid");
                return;
            }
            const response = await authJsonFetch({
                path: `groups/${groupId}/projects/${projectId}/requests`
            });
            if (!response?.status || response.status > 404 || !response?.data) {
                setProjectJoinRequestError(response?.error ?? defaultError);
                return;
            }
            setProjectJoinRequests(response.data as ProjectJoinRequestResponseDto[]);
        } catch (e) {
            setProjectJoinRequests([]);
            setProjectJoinRequestError(defaultError);
        } finally {
            setProjectJoinRequestsLoading(false);
        }
    }

    useEffect(() => {
        loadProjectJoinRequests().then();
    }, []);

    async function handleJoinRequest(requestId: number, status: RequestStatus) {
        const defaultError = "Failed to update join request status";
        try {
            setProjectJoinRequestsLoading(true);
            const response = await authJsonFetch({
                path: `groups/${groupId}/projects/${projectId}/requests/${requestId}`,
                method: "PUT",
                body: {
                    status: status
                }
            });
            if (!response?.status || response.status > 404 || !response?.message) {
                return handleErrorNotification(response?.error ?? defaultError);
            }
            notification.openNotification({
                type: "success", vertical: "top", horizontal: "center",
                message: response.message ?? `The status of the selected join request has been updated successfully`
            });
            await loadProjectJoinRequests();
        } catch (e) {
            handleErrorNotification(defaultError);
        } finally {
            setProjectJoinRequestsLoading(false);
        }
    }

    function handleDeclineClick(requestId: number) {
        dialog.openDialog({
            text: "Do you really wish to decline this project join request?",
            onConfirm: async () => {
                await handleJoinRequest(requestId, RequestStatus.DECLINED);
            }
        });
    }

    async function handleApproveClick(requestId: number) {
        await handleJoinRequest(requestId, RequestStatus.APPROVED);
    }

    if (permissionsLoading || projectJoinRequestsLoading) {
        return <LoadingSpinner/>;
    } else if (!projectPermissions?.length
        || !projectPermissions.includes(PermissionType.PROJECT_ADMIN)
        || projectJoinRequestError) {
        handleErrorNotification(projectJoinRequestError ?? "Access Denied: Insufficient permissions");
        navigate(`/groups/${groupId}/projects`, {replace: true});
        return <></>;
    }
    return (<div>
        {!projectJoinRequests?.length
            ? <div>
                <h3>No project join requests were found for this project.</h3>
            </div>
            : <div>
                <h3>Project Join Requests</h3>
                <ul>{projectJoinRequests.map(request => {
                    return <li key={request.requestId}>
                        <h4>{request.user?.username}</h4>
                        <p>{request.status}</p>
                        <button onClick={async () => {
                            await handleApproveClick(request.requestId)
                        }}>Approve
                        </button>
                        <button onClick={() => {
                            handleDeclineClick(request.requestId);
                        }}>Decline
                        </button>
                    </li>
                })}
                </ul>
            </div>
        }
        <button onClick={() => {
            navigate(`/groups/${groupId}/projects/${projectId}`)
        }}>
            Back
        </button>
    </div>)
}
