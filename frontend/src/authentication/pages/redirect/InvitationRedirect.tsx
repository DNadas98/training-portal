import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {useEffect, useState} from "react";
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
import {PreRegistrationDetailsResponseDto} from "../../dto/PreRegistrationDetailsResponseDto.ts";
import LegalPolicyCheckbox from "../../../common/utils/components/LegalPolicyCheckbox.tsx";
import SiteInformation from "../../../common/utils/components/SiteInformation.tsx";

export default function InvitationRedirect() {
  const [loading, setLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [fullNameDefaultValue, setFullNameDefaultValue] = useState<string>("");
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

  const fetchVerification = async (code: string, id: string, password: string, fullName?: string) => {
    const dto: PreRegistrationCompleteRequestDto = {
      password: password, fullName: fullName?.length ? fullName : undefined
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
      const fullNameInput = formData.get("fullName") as string | undefined;
      const confirmPassword = formData.get("confirmPassword") as string;
      if (password !== confirmPassword) {
        return notification.openNotification({
          type: "error", vertical: "top", horizontal: "center", message: "Passwords don't match"
        });
      }
      const code = searchParams.get("code");
      const id = searchParams.get("id");
      if (!code?.length || !id?.length || isNaN(parseInt(id)) || parseInt(id) < 1) {
        return handleProcessError("The received verification code is missing or invalid");
      }
      const response: ApiResponseDto = await fetchVerification(code, id, password, fullNameInput);
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

  useEffect(() => {
    async function fetchVerificationDetails() {
      try {
        const code = searchParams.get("code");
        const id = searchParams.get("id");
        if (!code?.length || !id?.length || isNaN(parseInt(id)) || parseInt(id) < 1) {
          return handleProcessError("The received verification code is missing or invalid");
        }
        const response: ApiResponseDto = await publicJsonFetch({
          path: `verification/invitation-accept?code=${code}&id=${id}`, method: "GET"
        });
        if (response.error || response?.status > 399 || !response.data) {
          return handleProcessError(response.error);
        }
        const detailsResponse: PreRegistrationDetailsResponseDto = response.data;
        if (detailsResponse.fullName) {
          setFullNameDefaultValue(detailsResponse.fullName);
        }
        setUsername(detailsResponse.username);
      } catch (e) {
        handleProcessError();
        clearSearchParams();
      } finally {
        setLoading(false);
      }
    }

    fetchVerificationDetails().then();
  }, []);

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
            <DialogContent><Stack spacing={2}>
              <Typography>
                Please enter a password to finalize your account registration! Please update your full name if necessary.
              </Typography>
              <SiteInformation/>
              <Box sx={{padding: 2}} component={"form"} onSubmit={handleVerification}><Stack
                spacing={2}>
                <LegalPolicyCheckbox/>
                <Typography>Username: {username}</Typography>
                <TextField type={"text"} label={"Full Name"} name={"fullName"}
                           defaultValue={fullNameDefaultValue}
                           inputProps={{minLength: 8, maxLength: 50}} required/>
                <TextField type={"password"} label={"Password"} name={"password"}
                           inputProps={{minLength: 8, maxLength: 50}} required/>
                <TextField type={"password"} label={"Confirm Password"} name={"confirmPassword"}
                           inputProps={{minLength: 8, maxLength: 50}} required/>
                <Button type={"submit"}>Submit</Button>
              </Stack></Box>
            </Stack></DialogContent>
          </Dialog>
  );
}
