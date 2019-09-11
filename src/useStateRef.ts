import React from 'react'

/**
 * Simple hook that keeps state inside the ref and provides
 * a getter function to read that value.
 *
 * Useful to battle staleness and to avoid need to specify
 * dependencies for callbacks and effects. Note that it also means
 * that changing such value won't rerun the effect. If that's desired,
 * don't use this hook.
 *
 * @param initialState
 */
export function useStateRef<T>(initialState: T | (() => T)) {
  const [state, setState] = React.useState(initialState)
  const ref = React.useRef<T>(state)
  ref.current = state
  const getValue = React.useCallback(() => ref.current, [])
  return [getValue, setState] as [typeof getValue, typeof setState]
}
