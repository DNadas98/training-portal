import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {ApiResponseDto} from "../../../common/api/dto/ApiResponseDto.ts";
import DialogAlert from "../../../common/utils/components/DialogAlert.tsx";
import {Box, Button, Dialog, DialogContent, DialogTitle, Stack} from "@mui/material";
import {PasswordResetDto} from "../../dto/PasswordResetDto.ts";
import usePublicJsonFetch from "../../../common/api/hooks/usePublicJsonFetch.tsx";
import {passwordRegex} from "../../../common/utils/regex.ts";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";
import PasswordInput from "../../components/inputs/PasswordInput.tsx";

export default function PasswordResetVerificationRedirect() {
  const [loading, setLoading] = useState<boolean>(false);
  const [processError, setProcessError] = useState<null | string>(null);
  const notification = useNotification();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const publicJsonFetch = usePublicJsonFetch();
  const localized = useLocalized();

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
      localized("pages.redirect.password_reset.error.default");
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
      if (!passwordRegex.test(password)) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: localized("inputs.password_invalid")
        });
        return;
      }
      if (password !== confirmPassword) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center", message: localized("inputs.confirm_password_invalid")
        });
        return;
      }
      const code = searchParams.get("code");
      const id = searchParams.get("id");
      if (!code?.length || !id?.length || isNaN(parseInt(id)) || parseInt(id) < 1) {
        return handleProcessError(localized("common.error.redirect.code_invalid"));
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
        ? <DialogAlert title={`${localized("common.errorTitle")}: ${processError}`} text={
          localized("common.error.redirect.unknown")
        } buttonText={localized("menus.home")} onClose={() => {
          navigate("/", {replace: true})
        }}/>
        : <Dialog open={true}>
          <DialogTitle>{localized("pages.redirect.password_reset_verification.enter_new_password")}</DialogTitle>
          <DialogContent><Box sx={{padding: 2}} component={"form"} onSubmit={handleVerification}><Stack
            spacing={2}>
            <PasswordInput/>
            <PasswordInput confirm={true}/>
            <Button type={"submit"}>{localized("common.submit")}</Button>
          </Stack></Box></DialogContent>
        </Dialog>
  );
}
