import {ApiRequestDto} from "../dto/ApiRequestDto.ts";
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

export function getRequestConfig(request: ApiRequestDto, locale: SupportedLocaleType, contentType: string | null): RequestInit {
  const requestConfig: RequestInit = {
    method: `${request?.method ?? "GET"}`,
    headers: {
      "Accept-Language": getFormattedLocale(locale),
    },
    credentials: "include"
  };
  if (request?.body) {
    if (contentType && contentType === "application/json") {
      requestConfig.body = JSON.stringify(request.body);
    } else {
      requestConfig.body = request.body as any;
    }
  }
  if (contentType && requestConfig.headers) {
    requestConfig.headers["Content-Type"] = contentType;
  }
  return requestConfig;
}

export function verifyHttpResponse(httpResponse: Response, contentType: string = "application/json"): void {
  if (!httpResponse?.status) {
    throw new Error("Invalid response received from the server");
  }
  if (httpResponse?.status !== 401 && httpResponse?.headers?.get("Content-Type") !== contentType) {
    throw new Error("Server response received in invalid format");
  }
}
