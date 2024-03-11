import * as apiService from "../../common/api/service/apiService.ts";
import {AuthenticationDto} from "../dto/AuthenticationDto.ts";
import {useAuthentication} from "./useAuthentication.ts";
import {RefreshResponseDto} from "../dto/RefreshResponseDto.ts";

export default function useRefresh() {
  const authentication = useAuthentication();
  const defaultErrorMessage="Failed to refresh authentication";
  const refresh = async (): Promise<RefreshResponseDto> => {
    try {
      const refreshResponse = await apiService.publicJsonFetch({
        path: "auth/refresh", method: "GET"
      });

      if (!refreshResponse
        || refreshResponse.status > 399
        || !refreshResponse.data
        || refreshResponse.error) {
        return {error: refreshResponse?.error ?? defaultErrorMessage};
      }

      const newAuthentication = refreshResponse.data as AuthenticationDto;
      authentication.authenticate(newAuthentication);
      return {newAuthentication: newAuthentication};
    } catch (e) {
      return {error: defaultErrorMessage};
    }
  };
  return refresh;
}
