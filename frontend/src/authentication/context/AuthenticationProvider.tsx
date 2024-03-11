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
  getEmail: () => undefined,
  getRoles: () => undefined,
  getAccountType: () => undefined,
  getAccessToken: () => undefined
});

export function AuthenticationProvider({children}: AuthenticationProviderProps) {
  const [authentication, setAuthentication] = useState<AuthenticationDto>({});

  const authenticate = (authentication: AuthenticationDto) => {
    if (!authentication.accessToken || !authentication.userInfo
      || !authentication.userInfo.email?.length
      || !authentication.userInfo.username?.length
      || !authentication.userInfo.roles?.length
      || !authentication.userInfo?.roles?.includes(GlobalRole.USER)
      || !authentication.userInfo?.accountType) {
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

  const getRoles = () => {
    return authentication.userInfo?.roles;
  };

  const getAccessToken = () => {
    return authentication.accessToken;
  };

  const getAccountType = () => {
    return authentication.userInfo?.accountType;
  };

  return (
    <AuthenticationContext.Provider
      value={{authenticate, logout, getUsername, getEmail, getRoles, getAccessToken, getAccountType}}>
      {children}
    </AuthenticationContext.Provider>
  );
}
