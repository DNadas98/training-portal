import RegisterCard from "./components/RegisterCard.tsx";
import {
  useNotification
} from "../../../common/notification/context/NotificationProvider.tsx";
import {FormEvent} from "react";
import {RegisterRequestDto} from "../../dto/RegisterRequestDto.ts";
import {publicJsonFetch} from "../../../common/api/service/apiService.ts";

export default function Register() {
  const notification = useNotification();
  const validatePassword = (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      notification.openNotification({
        type: "error", vertical: "top", horizontal: "center",
        message: "Passwords don't match",
      });
      return false;
    }
    return true;
  };

  const registerUser = async (registerRequestDto: RegisterRequestDto) => {
    return await publicJsonFetch({
      path: "auth/register", method: "POST", body: registerRequestDto
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

  const handleSuccess = (message: string) => {
    notification.openNotification({
      type: "success", vertical: "top", horizontal: "center", message: message
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const username = formData.get('username') as string;
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;

      const passwordIsValid = validatePassword(password, confirmPassword);
      if (!passwordIsValid) {
        return;
      }

      const registerRequestDto: RegisterRequestDto = {username, email, password};
      const response = await registerUser(registerRequestDto);

      if (response.error || response?.status > 399 || !response.message) {
        handleError(response.error);
        return;
      }

      handleSuccess(response.message);
    } catch (e) {
      const errorMessage = "An error has occurred during the sign up process";
      console.error(errorMessage);
      handleError(errorMessage);
    }
  };

  return (
    <RegisterCard onSubmit={handleSubmit}/>
  )
}
