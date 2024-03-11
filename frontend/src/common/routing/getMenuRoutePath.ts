import {IMenuRoutes} from "./IMenuRoutes.ts";

export default function getMenuRoutePath(menu: IMenuRoutes, path: string) {
  return `${menu.routePrefix?.length ? menu.routePrefix : "/"}${path}`;
}
