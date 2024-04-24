import {createContext, ReactNode, useState} from "react";
import {AuthenticationDto} from "../dto/AuthenticationDto.ts";
import {IAuthenticationContext} from "./IAuthenticationContext.ts";
import {GlobalRole} from "../dto/userInfo/GlobalRole.ts";

interface AuthenticationProviderProps {
  children: ReactNode;
}

export const AuthenticationContext = createContext<IAuthenticationContext>({
  authenticate: () => {
  },
  logout: () => {
  },
  getUsername: () => undefined,
  getFullName: () => undefined,
  getEmail: () => undefined,
  getRoles: () => undefined,
  getAccessToken: () => undefined
});

export function AuthenticationProvider({children}: AuthenticationProviderProps) {
  const [authentication, setAuthentication] = useState<AuthenticationDto>({});

  const authenticate = (authentication: AuthenticationDto) => {
    if (!authentication.accessToken || !authentication.userInfo
      || !authentication.userInfo.email?.length
      || !authentication.userInfo.username?.length
      || !authentication.userInfo.fullName?.length
      || !authentication.userInfo.roles?.length
      || !authentication.userInfo?.roles?.includes(GlobalRole.USER)) {
      throw new Error("The received authentication is invalid");
    }
    setAuthentication(authentication);
  };

  const logout = () => {
    setAuthentication({});
  };

  const getUsername = () => {
    return authentication.userInfo?.username;
  };

  const getEmail = () => {
    return authentication.userInfo?.email;
  };

  const getFullName = () => {
    return authentication.userInfo?.fullName;
  };

  const getRoles = () => {
    return authentication.userInfo?.roles;
  };

  const getAccessToken = () => {
    return authentication.accessToken;
  };

  return (
    <AuthenticationContext.Provider
      value={{authenticate, logout, getUsername, getEmail, getFullName, getRoles, getAccessToken}}>
      {children}
    </AuthenticationContext.Provider>
  );
}
