import {useContext} from "react";
import {IPermissionContext} from "../context/IPermissionContext.ts";
import {PermissionContext} from "../context/PermissionProvider.tsx";

export default function usePermissions() {
  return useContext<IPermissionContext>(PermissionContext)
}
