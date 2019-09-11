import React from 'react'

import { useRouterContext } from './useRouterContext'

interface IOptions {
  to?: string
  replace?: boolean
}

/**
 * Provides a function to navigate within Router context.
 * Navigation target can be specified directly in params
 * or overriden with call of the function.
 */
export function useRouterNavigate({ to, replace = false }: IOptions) {
  const context = useRouterContext()
  const navigate = React.useCallback(
    (opts: IOptions) => {
      const target = to || opts.to
      if (target) {
        if (replace || opts.replace) {
          context.history.replace(target)
        } else {
          context.history.push(target)
        }
      }
      return context.location
    },
    [context.history, context.location, replace, to],
  )

  return navigate
}
