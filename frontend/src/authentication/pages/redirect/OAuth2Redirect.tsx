import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import LoadingSpinner from "../../../common/utils/components/LoadingSpinner.tsx";
import useRefresh from "../../hooks/useRefresh.ts";
import DialogAlert from "../../../common/utils/components/DialogAlert.tsx";
import useLogout from "../../hooks/useLogout.ts";

export default function OAuth2Redirect() {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refresh = useRefresh();
  const logout = useLogout();

  const handleError = (error: string | undefined = undefined) => {
    const message = error ??
      "An error has occurred during the sign in process";
    setError(message);
  };

  const handleSuccess = async () => {
    await refresh();
    return navigate("/user");
  };

  useEffect(() => {
    async function handleOauth2Login() {
      const errorMessage = searchParams.get("error");
      if (errorMessage) {
        return handleError(errorMessage);
      }
      await handleSuccess();
    }

    handleOauth2Login().catch(() => {
      handleError();
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleDialog = async () => {
    await logout();
  };

  return (
    loading
      ? <LoadingSpinner/>
      : error
        ? <DialogAlert title={`Error: ${error}`} text={
          "You will be redirected to the Login page.\n"
          + "If the issue persists, please contact our support team."
        } buttonText={"Back"} onClose={handleDialog}/>
        : <></>
  );
}
