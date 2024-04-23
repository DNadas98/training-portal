import {useNotification} from "../../notification/context/NotificationProvider.tsx";
import {useAuthentication} from "../../../authentication/hooks/useAuthentication.ts";
import useRefresh from "../../../authentication/hooks/useRefresh.ts";
import useLogout from "../../../authentication/hooks/useLogout.ts";
import useLocaleContext from "../../localization/hooks/useLocaleContext.tsx";
import {ApiRequestDto} from "../dto/ApiRequestDto.ts";
import {getRequestConfig, handleUnknownError} from "../utils/apiUtils.ts";

export default function useAuthFetch() {
  const authentication = useAuthentication();
  const notification = useNotification();
  const refresh = useRefresh();
  const logout = useLogout();
  const {locale} = useLocaleContext();

  const notifyAndLogout = async (
    httpResponse: Response, errorMessage: string | undefined = undefined) => {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message:
        errorMessage
        ?? httpResponse.status === 403
          ? "Forbidden" : "Unauthorized"
    });
    return await logout();
  }
  const authFetch = async (request: ApiRequestDto):Promise<any>=> {
    try {
      const requestConfig = getRequestConfig(request, locale, request.contentType??null);
      const accessToken = authentication.getAccessToken();
      if (!accessToken) {
        throw new Error("Unauthorized");
      }
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      let httpResponse: Response = await authenticatedFetch(
        `${baseUrl}/${request.path}`, requestConfig, accessToken);
      if (httpResponse.status > 399) {
        let responseObject = await httpResponse?.json();

        // Refresh if the access token is expired, and try to re-fetch
        if (responseObject?.isAccessTokenExpired) {
          const refreshResponseDto = await refresh();

          // If the refresh token is also expired, log out
          if (!refreshResponseDto?.newAuthentication?.accessToken) {
            return await notifyAndLogout(httpResponse, refreshResponseDto.error);
          }
          httpResponse = await authenticatedFetch(
            `${baseUrl}/${request.path}`, requestConfig,
            refreshResponseDto.newAuthentication.accessToken);
        }

        // If still unauthorized, log out
        if (httpResponse.status === 401) {
          responseObject = await httpResponse?.json();
          return await notifyAndLogout(httpResponse, responseObject?.error);
        }
      }
      return httpResponse;
    } catch (e) {
      return handleUnknownError();
    }
  };
  return authFetch;
}

async function authenticatedFetch(path: string, requestConfig: RequestInit, accessToken: string): Promise<Response> {
  return await fetch(path, {
    ...requestConfig,
    headers: {
      ...requestConfig.headers,
      "Authorization": `Bearer ${accessToken}`
    }
  });
}
