import * as mobx from 'mobx'
import React from 'react'

import { useLiveReaction } from './useLiveReaction'

/**
 * Setup a reaction side effect with automatic disposal.
 *
 * The expression, effect and options are considered static and
 * cannot depend on unstable closure variables to avoid reaction to be recreated.
 *
 * For a more control, the useLiveReaction should be used instead.
 *
 * @param staticExpression
 * @param staticEffect
 * @returns A function for early reaction disposal
 */
export function useReaction<T>(
  staticExpression: (r: mobx.IReactionPublic) => T,
  staticEffect: (arg: T, r: mobx.IReactionPublic) => void,
  options?: mobx.IReactionOptions,
) {
  const expressionRef = React.useRef(staticExpression)
  const effectRef = React.useRef(staticEffect)
  const optionsRef = React.useRef(options)
  return useLiveReaction(
    expressionRef.current,
    effectRef.current,
    optionsRef.current,
  )
}
