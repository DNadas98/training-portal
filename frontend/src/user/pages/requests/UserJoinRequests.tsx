import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {
  CompanyJoinRequestResponseDto
} from "../../../companies/dto/requests/CompanyJoinRequestResponseDto.ts";
import {
  ProjectJoinRequestResponseDto
} from "../../../companies/dto/requests/ProjectJoinRequestResponseDto.ts";

export default function UserJoinRequests() {
  const dialog = useDialog();
  const [companyJoinRequestsLoading, setCompanyJoinRequestsLoading] = useState(true);
  const [companyJoinRequests, setCompanyJoinRequests] = useState<CompanyJoinRequestResponseDto[]>([]);
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

  async function loadCompanyJoinRequests() {
    const defaultError = `Failed to load company join requests`;
    try {
      setCompanyJoinRequestsLoading(true);
      const response = await authJsonFetch({
        path: `user/company-requests`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        handleErrorNotification(response?.error ?? defaultError);
        return;
      }
      setCompanyJoinRequests(response.data as CompanyJoinRequestResponseDto[]);
    } catch (e) {
      setCompanyJoinRequests([]);
      handleErrorNotification(defaultError);
    } finally {
      setCompanyJoinRequestsLoading(false);
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
    loadCompanyJoinRequests().then();
    loadProjectJoinRequests().then();
  }, []);

  async function deleteCompanyJoinRequest(requestId: number) {
    const defaultError = "Failed to delete company join request";
    try {
      setCompanyJoinRequestsLoading(true);
      const response = await authJsonFetch({
        path: `user/company-requests/${requestId}`, method: "DELETE"
      });
      if (!response?.status || response.status > 404 || !response?.message) {
        return handleErrorNotification(response?.error ?? defaultError);
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message
      });
      await loadCompanyJoinRequests();
    } catch (e) {
      handleErrorNotification(defaultError);
    } finally {
      setCompanyJoinRequestsLoading(false);
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

  function handleCompanyJoinRequestDeleteClick(requestId: number) {
    dialog.openDialog({
      text: "Do you really wish to delete this company join request?",
      onConfirm: async () => {
        await deleteCompanyJoinRequest(requestId);
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
    {companyJoinRequestsLoading ? <LoadingSpinner/> : !companyJoinRequests?.length
      ? <div>
        <h3>No pending company join requests were found.</h3>
      </div>
      : <div>
        <h3>Company Join Requests</h3>
        <ul>{companyJoinRequests.map(request => {
          return <li key={request.requestId}>
            <h4>{request.company?.name}</h4>
            <p>{request.status}</p>
            <button onClick={async () => {
              handleCompanyJoinRequestDeleteClick(request.requestId);
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
            <h4>{request.company?.name}</h4>
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
