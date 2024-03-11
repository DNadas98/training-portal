import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {
  GroupJoinRequestResponseDto
} from "../../../groups/dto/requests/GroupJoinRequestResponseDto.ts";
import {
  ProjectJoinRequestResponseDto
} from "../../../projects/dto/requests/ProjectJoinRequestResponseDto.ts";

export default function UserJoinRequests() {
  const dialog = useDialog();
  const [groupJoinRequestsLoading, setGroupJoinRequestsLoading] = useState(true);
  const [groupJoinRequests, setGroupJoinRequests] = useState<GroupJoinRequestResponseDto[]>([]);
  const [projectJoinRequestsLoading, setProjectJoinRequestsLoading] = useState(true);
  const [projectJoinRequests, setProjectJoinRequests] = useState<ProjectJoinRequestResponseDto[]>([]);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();

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
      const response = await authJsonFetch({
        path: `user/group-requests`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        handleErrorNotification(response?.error ?? defaultError);
        return;
      }
      setGroupJoinRequests(response.data as GroupJoinRequestResponseDto[]);
    } catch (e) {
      setGroupJoinRequests([]);
      handleErrorNotification(defaultError);
    } finally {
      setGroupJoinRequestsLoading(false);
    }
  }

  async function loadProjectJoinRequests() {
    const defaultError = `Failed to load project join requests`;
    try {
      setProjectJoinRequestsLoading(true);
      const response = await authJsonFetch({
        path: `user/project-requests`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        handleErrorNotification(response?.error ?? defaultError);
        return;
      }
      setProjectJoinRequests(response.data as ProjectJoinRequestResponseDto[]);
    } catch (e) {
      setProjectJoinRequests([]);
      handleErrorNotification(defaultError);
    } finally {
      setProjectJoinRequestsLoading(false);
    }
  }

  useEffect(() => {
    loadGroupJoinRequests().then();
    loadProjectJoinRequests().then();
  }, []);

  async function deleteGroupJoinRequest(requestId: number) {
    const defaultError = "Failed to delete group join request";
    try {
      setGroupJoinRequestsLoading(true);
      const response = await authJsonFetch({
        path: `user/group-requests/${requestId}`, method: "DELETE"
      });
      if (!response?.status || response.status > 404 || !response?.message) {
        return handleErrorNotification(response?.error ?? defaultError);
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message
      });
      await loadGroupJoinRequests();
    } catch (e) {
      handleErrorNotification(defaultError);
    } finally {
      setGroupJoinRequestsLoading(false);
    }
  }

  async function deleteProjectJoinRequest(requestId: number) {
    const defaultError = "Failed to delete project join request";
    try {
      setProjectJoinRequestsLoading(true);
      const response = await authJsonFetch({
        path: `user/project-requests/${requestId}`, method: "DELETE"
      });
      if (!response?.status || response.status > 404 || !response?.message) {
        return handleErrorNotification(response?.error ?? defaultError);
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message
      });
      await loadProjectJoinRequests();
    } catch (e) {
      handleErrorNotification(defaultError);
    } finally {
      setProjectJoinRequestsLoading(false);
    }
  }

  function handleGroupJoinRequestDeleteClick(requestId: number) {
    dialog.openDialog({
      text: "Do you really wish to delete this group join request?",
      onConfirm: async () => {
        await deleteGroupJoinRequest(requestId);
      }
    });
  }

  function handleProjectJoinRequestDeleteClick(requestId: number) {
    dialog.openDialog({
      text: "Do you really wish to delete this project join request?",
      onConfirm: async () => {
        await deleteProjectJoinRequest(requestId);
      }
    });
  }

  return (<div>
    {groupJoinRequestsLoading ? <LoadingSpinner/> : !groupJoinRequests?.length
      ? <div>
        <h3>No pending group join requests were found.</h3>
      </div>
      : <div>
        <h3>Group Join Requests</h3>
        <ul>{groupJoinRequests.map(request => {
          return <li key={request.requestId}>
            <h4>{request.group?.name}</h4>
            <p>{request.status}</p>
            <button onClick={async () => {
              handleGroupJoinRequestDeleteClick(request.requestId);
            }}>
              Delete
            </button>
          </li>
        })}
        </ul>
      </div>
    }
    {projectJoinRequestsLoading ? <LoadingSpinner/> : !projectJoinRequests?.length
      ? <div>
        <h3>No pending project join requests were found.</h3>
      </div>
      : <div>
        <h3>Project Join Requests</h3>
        <ul>{projectJoinRequests.map(request => {
          return <li key={request.requestId}>
            <h4>{request.project?.name}</h4>
            <p>{request.status}</p>
            <button onClick={async () => {
              handleProjectJoinRequestDeleteClick(request.requestId);
            }}>
              Delete
            </button>
          </li>
        })}
        </ul>
      </div>
    }
    <button onClick={() => {
      navigate(-1)
    }}>
      Back
    </button>
  </div>)
}
