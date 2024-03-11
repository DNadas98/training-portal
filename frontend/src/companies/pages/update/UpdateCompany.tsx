import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import {FormEvent, useEffect, useState} from "react";
import {CompanyCreateRequestDto} from "../../dto/CompanyCreateRequestDto.ts";
import {useNavigate, useParams} from "react-router-dom";
import {CompanyResponsePrivateDto} from "../../dto/CompanyResponsePrivateDto.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {CompanyUpdateRequestDto} from "../../dto/CompanyUpdateRequestDto.ts";
import usePermissions from "../../../authentication/hooks/usePermissions.ts";
import {
  PermissionType
} from "../../../authentication/dto/applicationUser/PermissionType.ts";
import UpdateCompanyForm from "./components/UpdateCompanyForm.tsx";

export default function UpdateCompany() {
  const {loading, companyPermissions} = usePermissions();
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const companyId = useParams()?.companyId;
  const [companyLoading, setCompanyLoading] = useState(true);
  const [company, setCompany] = useState<CompanyResponsePrivateDto | undefined>(undefined);
  const [companyErrorStatus, setCompanyError] = useState<string | undefined>(undefined);

  const handleError = (error?: string) => {
    const defaultError = "An unknown error has occurred, please try again later";
    setCompanyError(error ?? defaultError);
    notification.openNotification({
      type: "error",
      vertical: "top",
      horizontal: "center",
      message: error ?? defaultError,
    });
  };

  const idIsValid = companyId && !isNaN(parseInt(companyId)) && parseInt(companyId) > 0;


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
        return handleError(response?.error);
      }
      setCompany(response.data as CompanyResponsePrivateDto);
    } catch (e) {
      setCompany(undefined);
      setCompanyError(`Failed to load company with ID ${companyId}`);
      handleError();
    } finally {
      setCompanyLoading(false);
    }
  }

  useEffect(() => {
    loadCompany().then();
  }, []);

  const updateCompany = async (requestDto: CompanyCreateRequestDto) => {
    return await authJsonFetch({
      path: `companies/${companyId}`, method: "PUT", body: requestDto
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      setCompanyLoading(true);
      event.preventDefault();
      // @ts-ignore
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;

      const requestDto: CompanyUpdateRequestDto = {name, description};
      const response = await updateCompany(requestDto);

      if (!response || response.error || response?.status > 399 || !response.message || !response.data) {
        handleError(response?.error);
        return;
      }
      const addedCompany = response.data as CompanyResponsePrivateDto;
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message ?? "Company details updated successfully"
      })
      navigate(`/companies/${addedCompany.companyId}`);
    } catch (e) {
      handleError();
    } finally {
      setCompanyLoading(false);
    }
  };
  if (loading || companyLoading) {
    return <LoadingSpinner/>;
  } else if (!companyPermissions?.length
    || !companyPermissions.includes(PermissionType.COMPANY_EDITOR)
    || !company) {
    handleError(companyErrorStatus ?? "Access Denied: Insufficient permissions");
    navigate(`/companies/${companyId}`, {replace: true});
    return <></>;
  }
  return <UpdateCompanyForm onSubmit={handleSubmit} company={company}/>
}
