import useLocaleContext from "../../localization/hooks/useLocaleContext.tsx";
import {ApiRequestDto} from "../dto/ApiRequestDto.ts";
import {ApiResponseDto} from "../dto/ApiResponseDto.ts";
import {getRequestConfig, handleUnknownError, verifyHttpResponse} from "../utils/apiUtils.ts";

export default function usePublicJsonFetch() {
  const {locale} = useLocaleContext();
  const publicJsonFetch = async (request: ApiRequestDto): Promise<ApiResponseDto> => {
    try {
      const requestConfig = getRequestConfig(request, locale, "application/json");
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
  return publicJsonFetch;
}
