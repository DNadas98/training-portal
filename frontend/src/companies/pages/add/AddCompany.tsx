import {useAuthJsonFetch} from "../../../common/api/service/apiService.ts";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import AddCompanyForm from "./components/AddCompanyForm.tsx";
import {FormEvent, useState} from "react";
import {CompanyCreateRequestDto} from "../../dto/CompanyCreateRequestDto.ts";
import {useNavigate} from "react-router-dom";
import {CompanyResponsePrivateDto} from "../../dto/CompanyResponsePrivateDto.ts";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";

export default function AddCompany() {
  const authJsonFetch = useAuthJsonFetch();
  const notification = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const addCompany = async (requestDto: CompanyCreateRequestDto) => {
    return await authJsonFetch({
      path: "companies", method: "POST", body: requestDto
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
      // @ts-ignore
      const formData = new FormData(event.currentTarget);
      const name = formData.get('name') as string;
      const description = formData.get('description') as string;

      const requestDto: CompanyCreateRequestDto = {name, description};
      const response = await addCompany(requestDto);

      if (!response || response.error || response?.status > 399 || !response.message || !response.data) {
        handleError(response?.error ?? "An unknown error has occurred, please try again later");
        return;
      }
      const addedCompany = response.data as CompanyResponsePrivateDto;

      navigate(`/companies/${addedCompany.companyId}`);
    } catch (e) {
      handleError("An unknown error has occurred, please try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (loading
      ? <LoadingSpinner/>
      : <AddCompanyForm onSubmit={handleSubmit}/>
  )
}
