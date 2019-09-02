import React from 'react'

type TDisposable = () => void

const doNothingDisposer = () => {
  // noop
}

/**
 * Convenient hook to create a disposable effect.
 * Tracks and returns a function for early disposal.
 * Mostly as dependency for other hooks
 */
export function useDisposable<D extends TDisposable>(
  createDisposable: () => D,
) {
  const disposerRef = React.useRef<D | null>()
  const earlyDisposedRef = React.useRef(false)

  const lazyCreateDisposer = React.useCallback(
    (earlyDisposal: boolean) => {
      // ensure that we won't create a new disposer if it was early disposed
      if (earlyDisposedRef.current) {
        return doNothingDisposer
      }

      if (!disposerRef.current) {
        disposerRef.current = createDisposable()
      }
      return () => {
        if (disposerRef.current) {
          disposerRef.current()
          disposerRef.current = null
        }
        if (earlyDisposal) {
          earlyDisposedRef.current = true
        }
      }
    },
    [createDisposable],
  )

  React.useEffect(() => {
    return lazyCreateDisposer(false)
  }, [lazyCreateDisposer])

  return lazyCreateDisposer(true) as D
}
