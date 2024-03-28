import {AuthenticationDto} from "../dto/AuthenticationDto.ts";
import {useAuthentication} from "./useAuthentication.ts";
import {RefreshResponseDto} from "../dto/RefreshResponseDto.ts";
import usePublicJsonFetch from "../../common/api/hooks/usePublicJsonFetch.tsx";

export default function useRefresh() {
  const authentication = useAuthentication();
  const defaultErrorMessage = "Failed to refresh authentication";
  const publicJsonFetch = usePublicJsonFetch()
  const refresh = async (): Promise<RefreshResponseDto> => {
    try {
      const refreshResponse = await publicJsonFetch({
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
