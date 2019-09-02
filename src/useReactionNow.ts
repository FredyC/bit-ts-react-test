import * as mobx from 'mobx'
import React from 'react'

import { useReaction } from './useReaction'

/**
 * Setup a reaction side effect with proper disposal
 * and fire immediatelly upon first creation.
 *
 * The effect will cause reaction to be recreated to battle staleness,
 * but it won't fire again on such occassion.
 * Use `React.useCallback` to optimize reaction creation.
 *
 * @param staticExpression
 * @param staticEffect
 * @returns A function for early reaction disposal
 */
export function useReactionNow<T>(
  staticExpression: (r: mobx.IReactionPublic) => T,
  staticEffect: (arg: T, r: mobx.IReactionPublic) => void,
) {
  const effectRef = React.useRef(staticEffect)
  const options = React.useRef({
    fireImmediately: true,
  })
  return useReaction(
    staticExpression,
    React.useCallback((arg1, arg2) => {
      effectRef.current(arg1, arg2)
      if (options.current.fireImmediately) {
        // avoid fireImmediately on the next creation
        options.current = { fireImmediately: false }
      }
    }, []),
    options.current,
  )
}
