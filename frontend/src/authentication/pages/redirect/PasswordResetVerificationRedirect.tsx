import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {useState} from "react";
import {publicJsonFetch} from "../../../common/api/service/apiService.ts";
import {useNavigate, useSearchParams} from "react-router-dom";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {ApiResponseDto} from "../../../common/api/dto/ApiResponseDto.ts";
import DialogAlert from "../../../common/utils/components/DialogAlert.tsx";
import {Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import {PasswordResetDto} from "../../dto/PasswordResetDto.ts";

export default function PasswordResetVerificationRedirect() {
  const [loading, setLoading] = useState<boolean>(false);
  const [processError, setProcessError] = useState<null | string>(null);
  const notification = useNotification();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const fetchVerification = async (code: string, id: string, password: string) => {
    const dto: PasswordResetDto = {
      newPassword: password
    }
    return await publicJsonFetch({
      path: `verification/password-reset?code=${code}&id=${id}`, method: "POST", body: dto
    });
  };

  const handleProcessError = (error: string | undefined = undefined) => {
    const message = error ??
      "An error has occurred during the password reset verification process";
    setProcessError(message);
    clearSearchParams();
  };

  const handleSuccess = (message: string) => {
    notification.openNotification({
      type: "success", vertical: "top", horizontal: "center", message: message
    });
    navigate("/login");
  };

  const clearSearchParams = () => {
    setSearchParams((params) => {
      params.delete("code");
      params.delete("id");
      return params;
    })
  }

  const handleVerification = async (event: any) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.target);
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;
      if (password !== confirmPassword) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center", message: "Passwords don't match"
        });
        return;
      }
      const code = searchParams.get("code");
      const id = searchParams.get("id");
      if (!code?.length || !id?.length || isNaN(parseInt(id)) || parseInt(id) < 1) {
        return handleProcessError("The received verification code is missing or invalid");
      }
      const response: ApiResponseDto = await fetchVerification(code, id, password);
      if (response.error || response?.status > 399 || !response.message) {
        return handleProcessError(response.error);
      }
      handleSuccess(response.message);
      clearSearchParams();
    } catch (e) {
      handleProcessError();
      clearSearchParams();
    } finally {
      setLoading(false);
    }
  }

  return (
    loading
      ? <LoadingSpinner/>
      : processError
        ? <DialogAlert title={`Error: ${processError}`} text={
          "Return to the Home page or try again later.\n"
          + "If the issue persists, please contact our support team."
        } buttonText={"Home"} onClose={() => {
          navigate("/", {replace: true})
        }}/>
        : <Dialog open={true}>
          <DialogTitle>Enter New Password</DialogTitle>
          <DialogContent><Box sx={{padding: 2}} component={"form"} onSubmit={handleVerification}><Stack
            spacing={2}>
            <TextField type={"password"} label={"Password"} name={"password"}
                       inputProps={{minLength: 8, maxLength: 50}} required/>
            <TextField type={"password"} label={"Confirm Password"} name={"confirmPassword"}
                       inputProps={{minLength: 8, maxLength: 50}} required/>
            <Button type={"submit"}>Submit</Button>
          </Stack></Box></DialogContent>
        </Dialog>
  );
}
