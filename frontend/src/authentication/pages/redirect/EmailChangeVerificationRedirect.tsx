import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {useEffect, useState} from "react";
import {publicJsonFetch} from "../../../common/api/service/apiService.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {ApiResponseDto} from "../../../common/api/dto/ApiResponseDto.ts";
import DialogAlert from "../../../common/utils/components/DialogAlert.tsx";

export default function EmailChangeVerificationRedirect() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);
  const notification = useNotification();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchVerification = async (code: string, id: string) => {
    return await publicJsonFetch({
      path: `verification/email-change?code=${code}&id=${id}`, method: "POST"
    });
  };

  const handleError = (error: string | undefined = undefined) => {
    const message = error ??
      "An error has occurred during the e-mail change verification process";
    setError(message);
  };

  const handleSuccess = (message: string) => {
    notification.openNotification({
      type: "success", vertical: "top", horizontal: "center", message: message
    });
    navigate("/login");
  };

  useEffect(() => {
    const handleVerification = async () => {
      const code = searchParams.get("code");
      const id = searchParams.get("id");
      if (!code?.length || !id?.length || isNaN(parseInt(id)) || parseInt(id) < 1) {
        return handleError("The received verification code is missing or invalid");
      }

      const response: ApiResponseDto = await fetchVerification(code, id);
      if (response.error || response?.status > 399 || !response.message) {
        return handleError(response.error);
      }

      handleSuccess(response.message);
    }

    handleVerification().catch(() => {
      handleError();
    }).finally(() => {
      setSearchParams((params) => {
        params.delete("code");
        params.delete("id");
        return params;
      })
      setLoading(false);
    });
  }, []);

  const handleDialog = () => {
    navigate("/", {replace: true});
  };

  return (
    loading
      ? <LoadingSpinner/>
      : error
        ? <DialogAlert title={`Error: ${error}`} text={
          "Return to the Home page or try again later.\n"
          + "If the issue persists, please contact our support team."
        } buttonText={"Home"} onClose={handleDialog}/>
        : <></>
  );
}
