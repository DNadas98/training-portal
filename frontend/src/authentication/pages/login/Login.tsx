import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {FormEvent} from "react";
import {publicJsonFetch} from "../../../common/api/service/apiService.ts";
import LoginCard from "./components/LoginCard.tsx";
import {LoginRequestDto} from "../../dto/LoginRequestDto.ts";
import {useNavigate} from "react-router-dom";
import {useAuthentication} from "../../hooks/useAuthentication.ts";
import {AuthenticationDto} from "../../dto/AuthenticationDto.ts";

export default function Login() {
  const notification = useNotification();
  const authentication = useAuthentication();
  const navigate = useNavigate();

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

  const handleSuccess = (data: AuthenticationDto) => {
    authentication.authenticate(data);
    navigate("/user");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;

      const loginRequestDto: LoginRequestDto = {email, password};
      const response = await loginUser(loginRequestDto);

      if (response.error || response?.status > 399 || !response.data) {
        handleError(response.error);
        return;
      }

      handleSuccess(response.data as AuthenticationDto);
    } catch (e) {
      const errorMessage =
        "An error has occurred during the sign in process";
      handleError(errorMessage);
    }
  };

  return (
    <LoginCard onSubmit={handleSubmit}/>
  )
}
