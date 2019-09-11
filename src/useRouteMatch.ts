import React from 'react'
import { match as matchType, matchPath } from 'react-router'

import { useRouterContext } from './useRouterContext'

/**
 * Get the closest matched Route from a path specified in argument.
 * @param path Custom path to match
 */
export function useRouteMatch<Params extends Record<string, string>>(
  path?: string,
): matchType<Params> | null {
  const context = useRouterContext<Params>()
  const match = React.useMemo(
    () =>
      path
        ? matchPath<Params>(context.location.pathname, path)
        : (context.match as matchType<Params>),
    [path, context.location.pathname, context.match],
  )

  return match
}
