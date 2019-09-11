import { useRouteMatch } from './useRouteMatch'

/**
 * Get params of the closest matched Route from a path specified in argument.
 * @param path Custom path to match params in
 */
export function useRouteParams<Params extends Record<string, string>>(
  path?: string,
) {
  const match = useRouteMatch<Params>(path)
  return match && match.params
}
