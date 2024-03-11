import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {CompanyResponsePrivateDto} from "../../dto/CompanyResponsePrivateDto.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {
  PermissionType
} from "../../../authentication/dto/applicationUser/PermissionType.ts";
import {useDialog} from "../../../common/dialog/context/DialogProvider.tsx";

export default function CompanyDashboard() {
  const {loading, companyPermissions} = usePermissions();
  const dialog = useDialog();
  const companyId = useParams()?.companyId;
  const [companyLoading, setCompanyLoading] = useState(true);
  const [company, setCompany] = useState<CompanyResponsePrivateDto | undefined>(undefined);
  const [companyErrorStatus, setCompanyError] = useState<string | undefined>(undefined);
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();

  const idIsValid = companyId && !isNaN(parseInt(companyId)) && parseInt(companyId) > 0;

  function handleErrorNotification(message?: string) {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: `${message ?? `Failed to load company with ID ${companyId}`}`
    });
  }

  async function loadCompany() {
    try {
      setCompanyLoading(true);
      if (!idIsValid) {
        setCompanyError("The provided company ID is invalid");
        setCompanyLoading(false);
        return
      }
      const response = await authJsonFetch({
        path: `companies/${companyId}`
      });
      if (!response?.status || response.status > 404 || !response?.data) {
        setCompanyError(response?.error ?? `Failed to load company with ID ${companyId}`);
        return handleErrorNotification(response?.error);
      }
      setCompany(response.data as CompanyResponsePrivateDto);
    } catch (e) {
      setCompany(undefined);
      setCompanyError(`Failed to load company with ID ${companyId}`);
      handleErrorNotification();
    } finally {
      setCompanyLoading(false);
    }
  }

  useEffect(() => {
    loadCompany().then();
  }, []);

  async function deleteCompany() {
    try {
      setCompanyLoading(true);
      if (!idIsValid) {
        setCompanyError("The provided company ID is invalid");
        setCompanyLoading(false);
        return
      }
      const response = await authJsonFetch({
        path: `companies/${companyId}`, method: "DELETE"
      });
      if (!response?.status || response.status > 404 || !response?.message) {
        setCompanyError(response?.error ?? `Failed to remove company data`);
        return handleErrorNotification(response?.error);
      }
      setCompany(undefined);
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? "All company data has been removed successfully"
      })
      navigate("/companies", {replace: true});
    } catch (e) {
      setCompany(undefined);
      setCompanyError(`Failed to remove company data`);
      handleErrorNotification();
    } finally {
      setCompanyLoading(false);
    }
  }

  function handleDeleteClick() {
    dialog.openDialog({
      text: "Do you really wish to remove all company data, including all projects and tasks?",
      confirmText: "Yes, delete this company", onConfirm: deleteCompany
    });
  }

  function handleJoinRequestClick() {
    navigate(`/companies/${companyId}/requests`);
  }

  function handleProjectsClick() {
    navigate(`/companies/${companyId}/projects`);
  }

  if (loading || companyLoading) {
    return <LoadingSpinner/>;
  } else if (!companyPermissions?.length || !company) {
    handleErrorNotification(companyErrorStatus ?? "Access Denied: Insufficient permissions");
    navigate("/companies", {replace: true});
    return <></>;
  }
  return (
    <div>
      <h1>{company.name}</h1>
      <p>{company.description}</p>
      <p>Permissions: {companyPermissions.join(", ")}</p>
      <button onClick={handleProjectsClick}>View projects</button>
      {(companyPermissions.includes(PermissionType.COMPANY_EDITOR))
        && <div>
              <button onClick={() => {
                navigate(`/companies/${companyId}/update`)
              }}>Update company details
              </button>
          </div>
      }
      {(companyPermissions.includes(PermissionType.COMPANY_ADMIN))
        && <div>
              <button onClick={handleJoinRequestClick}>View company join requests</button>
              <br/>
              <button onClick={handleDeleteClick}>Remove all company details</button>
          </div>
      }
    </div>
  )
}
