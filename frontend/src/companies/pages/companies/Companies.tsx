import CompanyBrowser from "./components/CompanyBrowser.tsx";
import {FormEvent, useEffect, useMemo, useState} from "react";
import {CompanyResponsePublicDto} from "../../dto/CompanyResponsePublicDto.ts";
import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import {useNavigate} from "react-router-dom";

export default function Companies() {
  const [companiesWithUserLoading, setCompaniesWithUserLoading] = useState<boolean>(true);
  const [companiesWithUser, setCompaniesWithUser] = useState<CompanyResponsePublicDto[]>([]);
  const [companiesWithoutUserLoading, setCompaniesWithoutUserLoading] = useState<boolean>(true);
  const [companiesWithoutUser, setCompaniesWithoutUser] = useState<CompanyResponsePublicDto[]>([]);

  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();

  async function loadCompaniesWithUser() {
    try {
      const response = await authJsonFetch({
        path: `companies?withUser=true`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to load your companies"}`
        })
        return;
      }
      setCompaniesWithUser(response.data as CompanyResponsePublicDto[]);
    } catch (e) {
      setCompaniesWithUser([]);
    } finally {
      setCompaniesWithUserLoading(false);
    }
  }

  async function loadCompaniesWithoutUser() {
    try {
      const response = await authJsonFetch({
        path: `companies?withUser=false`
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to load companies to join"}`
        })
        return;
      }
      setCompaniesWithoutUser(response.data as CompanyResponsePublicDto[]);
    } catch (e) {
      setCompaniesWithoutUser([]);
    } finally {
      setCompaniesWithoutUserLoading(false);
    }
  }

  useEffect(() => {
    loadCompaniesWithUser().then();
    loadCompaniesWithoutUser().then();
  }, []);

  const [companiesWithUserFilterValue, setCompaniesWithUserFilterValue] = useState<string>("");
  const [companiesWithoutUserFilterValue, setCompaniesWithoutUserFilterValue] = useState<string>("");

  const companiesWithUserFiltered = useMemo(() => {
    return companiesWithUser.filter(company => {
        return company.name.toLowerCase().includes(companiesWithUserFilterValue)
      }
    );
  }, [companiesWithUser, companiesWithUserFilterValue]);

  const companiesWithoutUserFiltered = useMemo(() => {
    return companiesWithoutUser.filter(company => {
        return company.name.toLowerCase().includes(companiesWithoutUserFilterValue)
      }
    );
  }, [companiesWithoutUser, companiesWithoutUserFilterValue]);

  const handleCompaniesWithUserSearch = (event: FormEvent<HTMLInputElement>) => {
    // @ts-ignore
    setCompaniesWithUserFilterValue(event.target.value.toLowerCase().trim());
  };

  const handleCompaniesWithoutUserSearch = (event: FormEvent<HTMLInputElement>) => {
    // @ts-ignore
    setCompaniesWithoutUserFilterValue(event.target.value.toLowerCase().trim());
  };

  const [actionButtonDisabled, setActionButtonDisabled] = useState(false);

  async function sendCompanyJoinRequest(companyId: number) {
    try {
      setActionButtonDisabled(true)
      const response = await authJsonFetch({
        path: `companies/${companyId}/requests`, method: "POST"
      });
      if (!response?.status || response.status > 399 || !response?.data) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: `${response?.error ?? "Failed to send join request"}`
        })
        return;
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: "Your request to join the selected company was sent successfully"
      });
      await loadCompaniesWithoutUser();
    } catch (e) {
      notification.openNotification({
        type: "error", vertical: "top", horizontal: "center",
        message: `Failed to send join request`
      })
    } finally {
      setActionButtonDisabled(false);
    }
  }

  const loadCompanyDashboard = (companyId: number) => {
    setActionButtonDisabled(true);
    navigate(`/companies/${companyId}`);
    setActionButtonDisabled(false);
  }

  return (
    <CompanyBrowser companiesWithUser={companiesWithUserFiltered}
                    companiesWithUserLoading={companiesWithUserLoading}
                    companiesWithoutUser={companiesWithoutUserFiltered}
                    companiesWithoutUserLoading={companiesWithoutUserLoading}
                    handleCompaniesWithUserSearch={handleCompaniesWithUserSearch}
                    handleCompaniesWithoutUserSearch={handleCompaniesWithoutUserSearch}
                    handleViewDashboardClick={loadCompanyDashboard}
                    handleJoinRequestClick={sendCompanyJoinRequest}
                    actionButtonDisabled={actionButtonDisabled}/>
  )
}
