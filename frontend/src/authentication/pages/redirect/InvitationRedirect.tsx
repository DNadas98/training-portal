import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {ApiResponseDto} from "../../../common/api/dto/ApiResponseDto.ts";
import DialogAlert from "../../../common/utils/components/DialogAlert.tsx";
import {Box, Button, Dialog, DialogContent, DialogTitle, Stack, TextField, Typography} from "@mui/material";
import usePublicJsonFetch from "../../../common/api/hooks/usePublicJsonFetch.tsx";
import {PreRegistrationCompleteRequestDto} from "../../dto/PreRegistrationCompleteRequestDto.ts";
import {AuthenticationDto} from "../../dto/AuthenticationDto.ts";
import {useAuthentication} from "../../hooks/useAuthentication.ts";
import SuccessfulLoginRedirect from "../../components/SuccessfulLoginRedirect.tsx";

export default function InvitationRedirect() {
  const [loading, setLoading] = useState<boolean>(false);
  const [processError, setProcessError] = useState<null | string>(null);
  const notification = useNotification();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const publicJsonFetch = usePublicJsonFetch();
  const authentication = useAuthentication();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [activeQuestionnaireId, setActiveQuestionnaireId] = useState<number | null>(null);


  const fetchVerification = async (code: string, id: string, password: string) => {
    const dto: PreRegistrationCompleteRequestDto = {
      password: password
    }
    return await publicJsonFetch({
      path: `verification/invitation-accept?code=${code}&id=${id}`, method: "POST", body: dto
    });
  };

  const handleProcessError = (error: string | undefined = undefined) => {
    const message = error ??
      "An error has occurred during the registration process";
    setProcessError(message);
    clearSearchParams();
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
      if (response.error || response?.status > 399 || !response.data) {
        return handleProcessError(response.error);
      }
      const {userInfo, accessToken} = response.data as AuthenticationDto;
      authentication.authenticate({userInfo, accessToken});
      clearSearchParams();
      const groupId = response.data.groupId;
      const projectId = response.data.projectId;
      const questionnaireId = response.data.questionnaireId;
      setActiveGroupId(groupId);
      setActiveProjectId(projectId);
      setActiveQuestionnaireId(questionnaireId);
      setIsLoggedIn(true);
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
        : isLoggedIn
          ? <SuccessfulLoginRedirect groupId={activeGroupId} projectId={activeProjectId}
                                     questionnaireId={activeQuestionnaireId}/>
          : <Dialog open={true}>
            <DialogTitle>Complete Your Registration</DialogTitle>
            <DialogContent>
              <Typography mb={2}>
                Please enter a password to finalize your account registration!
              </Typography>
              <Box sx={{padding: 2}} component={"form"} onSubmit={handleVerification}><Stack
                spacing={2}>
                <TextField type={"password"} label={"Password"} name={"password"}
                           inputProps={{minLength: 8, maxLength: 50}} required/>
                <TextField type={"password"} label={"Confirm Password"} name={"confirmPassword"}
                           inputProps={{minLength: 8, maxLength: 50}} required/>
                <Button type={"submit"}>Submit</Button>
              </Stack></Box>
            </DialogContent>
          </Dialog>
  );
}
