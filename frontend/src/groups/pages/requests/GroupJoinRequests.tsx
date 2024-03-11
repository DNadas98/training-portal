import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import {GroupJoinRequestResponseDto} from "../../dto/requests/GroupJoinRequestResponseDto.ts";
import {RequestStatus} from "../../dto/RequestStatus.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";

export default function GroupJoinRequests() {
  const {loading, groupPermissions} = usePermissions();
  const dialog = useDialog();
  const groupId = useParams()?.groupId;
  const [groupJoinRequestsLoading, setGroupJoinRequestsLoading] = useState(true);
  const [groupJoinRequests, setGroupJoinRequests] = useState<GroupJoinRequestResponseDto[]>([]);
  const [groupJoinRequestError, setGroupJoinRequestError] = useState<string | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();

  const idIsValid = groupId && !isNaN(parseInt(groupId)) && parseInt(groupId) > 0;

  function handleErrorNotification(message: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: message
    });
  }

  async function loadGroupJoinRequests() {
    const defaultError = `Failed to load group join requests`;
    try {
      setGroupJoinRequestsLoading(true);
      if (!idIsValid) {
        setGroupJoinRequestError("The provided group ID is invalid");
        return;
      }
      const response = await authJsonFetch({
        path: `groups/${groupId}/requests`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setGroupJoinRequestError(response?.error ?? defaultError);
        return;
      }
      setGroupJoinRequests(response.data as GroupJoinRequestResponseDto[]);
    } catch (e) {
      setGroupJoinRequests([]);
      setGroupJoinRequestError(defaultError);
    } finally {
      setGroupJoinRequestsLoading(false);
    }
  }

  useEffect(() => {
    loadGroupJoinRequests().then();
  }, []);

  async function handleJoinRequest(requestId: number, status: RequestStatus) {
    const defaultError = "Failed to update join request status";
    try {
      setGroupJoinRequestsLoading(true);
      const response = await authJsonFetch({
        path: `groups/${groupId}/requests/${requestId}`, method: "PUT", body: {
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
      await loadGroupJoinRequests();
    } catch (e) {
      handleErrorNotification(defaultError);
    } finally {
      setGroupJoinRequestsLoading(false);
    }
  }

  function handleDeclineClick(requestId: number) {
    dialog.openDialog({
      text: "Do you really wish to decline this group join request?",
      onConfirm: async () => {
        await handleJoinRequest(requestId, RequestStatus.DECLINED);
      }
    });
  }

  async function handleApproveClick(requestId: number) {
    await handleJoinRequest(requestId, RequestStatus.APPROVED);
  }

  if (loading || groupJoinRequestsLoading) {
    return <LoadingSpinner/>;
  } else if (!groupPermissions?.length || groupJoinRequestError) {
    handleErrorNotification(groupJoinRequestError ?? "Access Denied: Insufficient permissions");
    navigate(`/groups`, {replace: true});
    return <></>;
  }
  return (<div>
    {!groupJoinRequests?.length
      ? <div>
        <h3>No group join requests were found for this group.</h3>
      </div>
      : <div>
        <h3>Group Join Requests</h3>
        <ul>{groupJoinRequests.map(request => {
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
      navigate(`/groups/${groupId}`)
    }}>
      Back
    </button>
  </div>)
}
