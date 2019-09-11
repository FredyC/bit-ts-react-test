import React from 'react'
import * as Router from 'react-router'

export function useRouterContext<
  Params extends { [K in keyof Params]?: string } = {}
>(): Router.RouteComponentProps<Params> {
  // @ts-ignore
  return React.useContext(Router.__RouterContext)
}
