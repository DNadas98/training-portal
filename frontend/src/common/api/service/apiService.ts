import {ApiRequestDto} from "../dto/ApiRequestDto.ts";
import {ApiResponseDto} from "../dto/ApiResponseDto.ts";
import {useNotification} from "../../notification/context/NotificationProvider.tsx";
import useLogout from "../../../authentication/hooks/useLogout.ts";
import useRefresh from "../../../authentication/hooks/useRefresh.ts";
import {useAuthentication} from "../../../authentication/hooks/useAuthentication.ts";

export async function publicJsonFetch(request: ApiRequestDto): Promise<ApiResponseDto> {
  try {
    const requestConfig = getRequestConfig(request);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const httpResponse: Response = await fetch(`${baseUrl}/${request.path}`, requestConfig);
    verifyHttpResponse(httpResponse);
    const responseObject = await httpResponse?.json();
    const apiResponse: ApiResponseDto = {...responseObject, status: httpResponse.status}
    return apiResponse;
  } catch (e) {
    return handleUnknownError();
  }
}

export function useAuthJsonFetch() {
  const notification = useNotification();
  const authentication = useAuthentication();
  const refresh = useRefresh();
  const logout = useLogout();

  const notifyAndLogout = async (
    httpResponse: Response, errorMessage: string | undefined = undefined) => {
    notification.openNotification({
      type: "error", vertical: "top", horizontal: "center",
      message:
        errorMessage
        ?? httpResponse.status === 403
          ? "Forbidden" : "Unauthorized"
    })
    return await logout();
  }
  const authJsonFetch = async (request: ApiRequestDto) => {
    try {
      const requestConfig = getRequestConfig(request);
      const accessToken = authentication.getAccessToken();
      if (!accessToken) {
        throw new Error("Unauthorized");
      }
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      let httpResponse: Response = await authenticatedFetch(
        `${baseUrl}/${request.path}`, requestConfig, accessToken);
      verifyHttpResponse(httpResponse);
      let responseObject = await httpResponse?.json();

      // Refresh if the access token is expired, and try to re-fetch
      if (responseObject?.isAccessTokenExpired) {
        const refreshResponseDto = await refresh();

        // If the refresh token is also expired:
        if (!refreshResponseDto?.newAuthentication?.accessToken) {
          return await notifyAndLogout(httpResponse, refreshResponseDto.error);
        }
        httpResponse = await authenticatedFetch(
          `${baseUrl}/${request.path}`, requestConfig,
          refreshResponseDto.newAuthentication.accessToken);
        responseObject = await httpResponse?.json();
      }

      // If Unauthorized or Forbidden:
      if (httpResponse.status === 401) {
        return await notifyAndLogout(httpResponse, responseObject?.error);
      }

      const apiResponse: ApiResponseDto = {
        ...responseObject,
        status: httpResponse.status
      };
      return apiResponse;
    } catch (e) {
      return handleUnknownError();
    }
  };
  return authJsonFetch;
}

function getRequestConfig(request: ApiRequestDto): RequestInit {
  const requestConfig: RequestInit = {
    method: `${request?.method ?? "GET"}`,
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  };
  if (request?.body) {
    requestConfig.body = JSON.stringify(request.body);
  }
  return requestConfig;
}

function verifyHttpResponse(httpResponse: Response): void {
  if (!httpResponse?.status) {
    throw new Error("Invalid response received from the server");
  }
  if (httpResponse?.status !== 401 && httpResponse?.headers?.get("Content-Type") !== "application/json") {
    throw new Error("Server response received in invalid format");
  }
}

function handleUnknownError(): ApiResponseDto {
  console.error("Failed to load requested resource");
  return {
    status: 500,
    error: "An unknown error has occurred"
  };
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
