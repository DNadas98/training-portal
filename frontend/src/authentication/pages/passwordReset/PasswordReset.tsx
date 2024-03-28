import {useNotification} from "../../../common/notification/context/NotificationProvider.tsx";
import {FormEvent} from "react";
import PasswordResetCard from "./components/PasswordResetCard.tsx";
import {useNavigate} from "react-router-dom";
import {PasswordResetRequestDto} from "../../dto/PasswordResetRequestDto.ts";
import usePublicJsonFetch from "../../../common/api/hooks/usePublicJsonFetch.tsx";

export default function PasswordReset() {
  const notification = useNotification();
  const navigate = useNavigate();
  const publicJsonFetch = usePublicJsonFetch();

  const handleError = (error: string | undefined = undefined) => {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message: error ?? "An error has occurred during the password reset request process",
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      const dto: PasswordResetRequestDto = {email: formData.get('email') as string};
      const response = await publicJsonFetch({path: "auth/reset-password", method: "POST", body: dto})

      if (response.error || response?.status > 399 || !response.message) {
        handleError(response.error);
        return;
      }
      notification.openNotification({
        type: "success", vertical: "top", horizontal: "center",
        message: response.message
      });
      navigate("/");
    } catch (e) {
      const errorMessage =
        "An error has occurred during the sign in process";
      handleError(errorMessage);
    }
  };

  return (
    <PasswordResetCard onSubmit={handleSubmit}/>
  )
}
