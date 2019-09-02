import * as mobx from 'mobx'
import React from 'react'

import { useDisposable } from './useDisposable'

/**
 * Setup autorun reaction.
 *
 * The view and options are considered static and cannot depend on
 * unstable closure variables to avoid reaction to be recreated.
 *
 * @see https://mobx.js.org/refguide/autorun.html
 * @param view
 * @param options
 */
export function useAutorun<T>(
  view: (r: mobx.IReactionPublic) => T,
  options?: mobx.IAutorunOptions,
) {
  const viewRef = React.useRef(view)
  const optionsRef = React.useRef(options)
  return useDisposable(
    React.useCallback(
      () => mobx.autorun(viewRef.current, optionsRef.current),
      [],
    ),
  )
}
