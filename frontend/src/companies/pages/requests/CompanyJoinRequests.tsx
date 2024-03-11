import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import {CompanyJoinRequestResponseDto} from "../../dto/requests/CompanyJoinRequestResponseDto.ts";
import {RequestStatus} from "../../dto/RequestStatus.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";

export default function CompanyJoinRequests() {
  const {loading, companyPermissions} = usePermissions();
  const dialog = useDialog();
  const companyId = useParams()?.companyId;
  const [companyJoinRequestsLoading, setCompanyJoinRequestsLoading] = useState(true);
  const [companyJoinRequests, setCompanyJoinRequests] = useState<CompanyJoinRequestResponseDto[]>([]);
  const [companyJoinRequestError, setCompanyJoinRequestError] = useState<string | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();

  const idIsValid = companyId && !isNaN(parseInt(companyId)) && parseInt(companyId) > 0;

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
      if (!idIsValid) {
        setCompanyJoinRequestError("The provided company ID is invalid");
        return;
      }
      const response = await authJsonFetch({
        path: `companies/${companyId}/requests`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setCompanyJoinRequestError(response?.error ?? defaultError);
        return;
      }
      setCompanyJoinRequests(response.data as CompanyJoinRequestResponseDto[]);
    } catch (e) {
      setCompanyJoinRequests([]);
      setCompanyJoinRequestError(defaultError);
    } finally {
      setCompanyJoinRequestsLoading(false);
    }
  }

  useEffect(() => {
    loadCompanyJoinRequests().then();
  }, []);

  async function handleJoinRequest(requestId: number, status: RequestStatus) {
    const defaultError = "Failed to update join request status";
    try {
      setCompanyJoinRequestsLoading(true);
      const response = await authJsonFetch({
        path: `companies/${companyId}/requests/${requestId}`, method: "PUT", body: {
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
      await loadCompanyJoinRequests();
    } catch (e) {
      handleErrorNotification(defaultError);
    } finally {
      setCompanyJoinRequestsLoading(false);
    }
  }

  function handleDeclineClick(requestId: number) {
    dialog.openDialog({
      text: "Do you really wish to decline this company join request?",
      onConfirm: async () => {
        await handleJoinRequest(requestId, RequestStatus.DECLINED);
      }
    });
  }

  async function handleApproveClick(requestId: number) {
    await handleJoinRequest(requestId, RequestStatus.APPROVED);
  }

  if (loading || companyJoinRequestsLoading) {
    return <LoadingSpinner/>;
  } else if (!companyPermissions?.length || companyJoinRequestError) {
    handleErrorNotification(companyJoinRequestError ?? "Access Denied: Insufficient permissions");
    navigate(`/companies`, {replace: true});
    return <></>;
  }
  return (<div>
    {!companyJoinRequests?.length
      ? <div>
        <h3>No company join requests were found for this company.</h3>
      </div>
      : <div>
        <h3>Company Join Requests</h3>
        <ul>{companyJoinRequests.map(request => {
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
      navigate(`/companies/${companyId}`)
    }}>
      Back
    </button>
  </div>)
}
