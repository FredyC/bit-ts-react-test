import * as mobx from 'mobx'
import React from 'react'

import { useDisposable } from './useDisposable'

/**
 * Setup a one time reaction with automatic disposal.
 *
 * The predicate, effect and options are considered static and
 * cannot depend on unstable closure variables to avoid reaction to be recreated.
 *
 * @param staticPredicate
 * @param staticEffect
 * @returns A function for early reaction disposal
 */
export function useWhen(
  staticPredicate: () => boolean,
  staticEffect: mobx.Lambda,
) {
  const predicateRef = React.useRef(staticPredicate)
  const effectRef = React.useRef(staticEffect)
  return useDisposable(
    React.useCallback(
      () => mobx.when(predicateRef.current, effectRef.current),
      [],
    ),
  )
}
