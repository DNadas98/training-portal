import {IAuthenticationContext} from "../context/IAuthenticationContext.ts";
import {useContext} from "react";
import {AuthenticationContext} from "../context/AuthenticationProvider.tsx";


export function useAuthentication(): IAuthenticationContext {
    return useContext(AuthenticationContext);
}
