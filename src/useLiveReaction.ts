import * as mobx from 'mobx'
import React from 'react'

import { useDisposable } from './useDisposable'

/**
 * Setup a reaction side effect with automatic disposal.
 *
 * Use if effect depends on unstable closure variables.
 * The effect change will cause the reaction to be recreated.
 * Use `React.useCallback` to optimize that.
 *
 * The expression is always considered static and should not refer to unstable
 * closure variables.
 *
 * If you specify any options, it's advisable to use `React.useMemo`
 * to prevent reaction to be recreated on each render.
 *
 * @param expression
 * @param effect
 * @returns A function for early reaction disposal
 */
export function useLiveReaction<T>(
  expression: (r: mobx.IReactionPublic) => T,
  effect: (arg: T, r: mobx.IReactionPublic) => void,
  options?: mobx.IReactionOptions,
) {
  const expressionRef = React.useRef(expression)
  return useDisposable(
    React.useCallback(
      () => mobx.reaction(expressionRef.current, effect, options),
      [effect, options],
    ),
  )
}
