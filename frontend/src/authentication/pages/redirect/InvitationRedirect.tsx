import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import {ApiResponseDto} from "../../../common/api/dto/ApiResponseDto.ts";
import DialogAlert from "../../../common/utils/components/DialogAlert.tsx";
import {Box, Button, Dialog, DialogContent, Stack, Typography} from "@mui/material";
import usePublicJsonFetch from "../../../common/api/hooks/usePublicJsonFetch.tsx";
import {PreRegistrationCompleteRequestDto} from "../../dto/PreRegistrationCompleteRequestDto.ts";
import {AuthenticationDto} from "../../dto/AuthenticationDto.ts";
import {useAuthentication} from "../../hooks/useAuthentication.ts";
import SuccessfulLoginRedirect from "../../components/SuccessfulLoginRedirect.tsx";
import {PreRegistrationDetailsResponseDto} from "../../dto/PreRegistrationDetailsResponseDto.ts";
import LegalPolicyCheckbox from "../../../common/utils/components/LegalPolicyCheckbox.tsx";
import SiteInformation from "../../../common/utils/components/SiteInformation.tsx";
import useLocalized from "../../../common/localization/hooks/useLocalized.tsx";
import {passwordRegex} from "../../../common/utils/regex.ts";
import PasswordInput from "../../components/inputs/PasswordInput.tsx";
import LocaleMenu from "../../../common/menu/LocaleMenu.tsx";
import HomeList from "../../../public/pages/home/components/HomeList.tsx";
import IsSmallScreen from "../../../common/utils/IsSmallScreen.tsx";
import FullNameInput from "../../components/inputs/FullNameInput.tsx";

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
  const localized = useLocalized();
  const isSmallScreen = IsSmallScreen();

  const fetchVerification = async (code: string, id: string, password: string, fullName?: string) => {
    const dto: PreRegistrationCompleteRequestDto = {
      password: password, fullName: fullName?.length ? fullName : undefined
    }
    return await publicJsonFetch({
      path: `verification/invitation-accept?code=${code}&id=${id}`, method: "POST", body: dto
    });
  };

  const handleProcessError = (error: string | undefined = undefined) => {
    const message = error ?? "";
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
      if (!passwordRegex.test(password)) {
        notification.openNotification({
          type: "error", vertical: "top", horizontal: "center",
          message: localized("inputs.password_invalid")
        });
        return;
      }
      if (password !== confirmPassword) {
        return notification.openNotification({
          type: "error", vertical: "top", horizontal: "center", message: localized("inputs.confirm_password_invalid")
        });
      }
      const code = searchParams.get("code");
      const id = searchParams.get("id");
      if (!code?.length || !id?.length || isNaN(parseInt(id)) || parseInt(id) < 1) {
        return handleProcessError(localized("common.error.redirect.code_invalid"));
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
          return handleProcessError(localized("common.error.redirect.code_invalid"));
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
        ? <DialogAlert title={`${processError}`} text={
          localized("common.error.redirect.unknown")
        } buttonText={"Home"} onClose={() => {
          navigate("/", {replace: true});
        }}/>
        : isLoggedIn
          ? <SuccessfulLoginRedirect groupId={activeGroupId} projectId={activeProjectId}
                                     questionnaireId={activeQuestionnaireId}/>
          : <Dialog open={true} maxWidth={"lg"} fullScreen={isSmallScreen}>
            <DialogContent><Stack spacing={1}>
              <Stack spacing={1} direction={"row"} flexWrap={"wrap"} mb={2} alignItems={"flex-start"}
                     justifyContent={"space-between"}>
                <Typography variant={"h6"}>{localized("pages.pre_registration.title")}</Typography>
                <LocaleMenu/>
              </Stack>
              <HomeList/>
              <Stack spacing={0.5} sx={{pl: 2, pr: 2}}>
                {localized("pages.pre_registration.info").split("\n").map((row, i) => <Typography key={i}>
                  {row}
                </Typography>)}
              </Stack>
              <SiteInformation/>
              <Box sx={{pl: 2, pr: 2}} component={"form"} onSubmit={handleVerification}><Stack
                spacing={2}>
                <Typography>{localized("inputs.password_invalid")}</Typography>
                <LegalPolicyCheckbox/>
                <Typography>{localized("inputs.username")}: {username}</Typography>
                <FullNameInput defaultValue={fullNameDefaultValue}/>
                <PasswordInput/>
                <PasswordInput confirm={true}/>
                <Button type={"submit"}>{localized("pages.pre_registration.submit_button")}</Button>
              </Stack></Box>
            </Stack></DialogContent>
          </Dialog>
  );
}
