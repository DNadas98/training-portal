import React from "react";

interface IMenuRouteElement {
  path: string,
  name: string,
  element: React.ReactNode
}

export interface IMenuRoutes {
  routePrefix: string,
  elements: IMenuRouteElement[]
}
