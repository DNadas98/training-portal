import {ApiRequestDto} from "../dto/ApiRequestDto.ts";
import {ApiResponseDto} from "../dto/ApiResponseDto.ts";
import {SupportedLocaleType} from "../../localization/context/SupportedLocaleType.ts";

function getFormattedLocale(locale) {
  if (!locale) {
    return "";
  } else if (locale?.length <= 2) {
    return locale
  } else {
    return `${locale.substring(0, 2)}-${locale.substring(2)}`;
  }
}

export function getRequestConfig(request: ApiRequestDto, locale: SupportedLocaleType, contentType:string="application/json"): RequestInit {
  const requestConfig: RequestInit = {
    method: `${request?.method ?? "GET"}`,
    headers: {
      "Content-Type": contentType,
      "Accept-Language": getFormattedLocale(locale),
    },
    credentials: "include"
  };
  if (request?.body) {
    requestConfig.body = JSON.stringify(request.body);
  }
  return requestConfig;
}

export function verifyHttpResponse(httpResponse: Response, contentType:string="application/json"): void {
  if (!httpResponse?.status) {
    throw new Error("Invalid response received from the server");
  }
  if (httpResponse?.status !== 401 && httpResponse?.headers?.get("Content-Type") !== contentType) {
    throw new Error("Server response received in invalid format");
  }
}

export function handleUnknownError(): ApiResponseDto {
  console.error("Failed to load requested resource");
  return {
    status: 500,
    error: "An unknown error has occurred"
  };
}


