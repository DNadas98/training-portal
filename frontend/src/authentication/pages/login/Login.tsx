import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {FormEvent, useState} from "react";
import LoginCard from "./components/LoginCard.tsx";
import {LoginRequestDto} from "../../dto/LoginRequestDto.ts";
import {useAuthentication} from "../../hooks/useAuthentication.ts";
import {AuthenticationDto} from "../../dto/AuthenticationDto.ts";
import usePublicJsonFetch from "../../../common/api/hooks/usePublicJsonFetch.tsx";
import SuccessfulLoginRedirect from "../../components/SuccessfulLoginRedirect.tsx";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";

export default function Login() {
  const notification = useNotification();
  const authentication = useAuthentication();
  const publicJsonFetch = usePublicJsonFetch();
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState<number | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
  const [activeQuestionnaireId, setActiveQuestionnaireId] = useState<number | null>(null);

  const loginUser = async (loginRequestDto: LoginRequestDto) => {
    return await publicJsonFetch({
      path: "auth/login", method: "POST", body: loginRequestDto
    });
  };

  const handleError = (error: string | undefined = undefined) => {
    notification.openNotification({
      type: "error",
      vertical: "top",
      horizontal: "center",
      message: error ?? "An error has occurred during the sign up process",
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setLoading(true);
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const loginRequestDto: LoginRequestDto = {email, password};
      const response = await loginUser(loginRequestDto);

      if (response.error || response?.status > 399 || !response.data) {
        handleError(response.error);
        return;
      }

      const {userInfo, accessToken} = response.data as AuthenticationDto;
      authentication.authenticate({userInfo, accessToken});

      const groupId = response.data.groupId;
      const projectId = response.data.projectId;
      const questionnaireId = response.data.questionnaireId;
      setActiveGroupId(groupId);
      setActiveProjectId(projectId);
      setActiveQuestionnaireId(questionnaireId);
      setIsLoggedIn(true);
    } catch (e) {
      const errorMessage =
        "An error has occurred during the sign in process";
      handleError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return loading
    ? <LoadingSpinner/>
    : !isLoggedIn
      ? <LoginCard onSubmit={handleSubmit}/>
      : <SuccessfulLoginRedirect groupId={activeGroupId} projectId={activeProjectId}
                                 questionnaireId={activeQuestionnaireId}/>
}
