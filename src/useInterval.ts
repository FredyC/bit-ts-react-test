import React from 'react'

// Gracefully borrowed from https://github.com/imbhargav5/rooks/blob/dev/packages/shared/useInterval.ts
// to make it tree shakeable

interface IntervalHandlerAsObject {
  /**
   * Function to start the interval
   */
  start: () => void
  /**
   * Function to stop the interval
   */
  stop: () => void
  /**
   * IntervalId of the interval
   */
  intervalId: number | null
}

interface IntervalHandlerAsArray extends Array<null | number | (() => void)> {
  0: () => void
  1: () => void
  2: number | null
}

/**
 *
 * useInterval hook
 *
 * Declaratively creates a setInterval to run a callback after a fixed
 * amount of time
 *
 *@param {function} callback - Callback to be fired
 *@param {number} intervalId - Interval duration in milliseconds after which the callback is to be fired
 *@param {boolean} startImmediate - Whether the interval should start immediately on initialise
 */
export function useInterval(
  callback: () => unknown,
  intervalDuration: number,
  startImmediate: boolean = false,
) {
  const [intervalId, setIntervalId] = React.useState<number | null>(null)
  const [isRunning, setIsRunning] = React.useState(startImmediate)
  const savedCallback = React.useRef<() => unknown>()

  const start = React.useCallback(() => {
    if (!isRunning) {
      setIsRunning(true)
    }
  }, [isRunning])

  const stop = React.useCallback(() => {
    if (isRunning) {
      setIsRunning(false)
    }
  }, [isRunning])

  // Remember the latest callback.
  React.useEffect(() => {
    savedCallback.current = callback
  })

  // Set up the interval.
  React.useEffect(() => {
    function tick() {
      savedCallback.current && savedCallback.current()
    }
    if (intervalDuration !== null && isRunning) {
      let id = setInterval(tick, intervalDuration)
      setIntervalId(id)
      return () => clearInterval(id)
    }
    return
  }, [intervalDuration, isRunning])

  let handler: unknown
  ;(handler as IntervalHandlerAsArray) = [start, stop, intervalId]
  ;(handler as IntervalHandlerAsObject).start = start
  ;(handler as IntervalHandlerAsObject).stop = stop
  ;(handler as IntervalHandlerAsObject).intervalId = intervalId

  return handler as IntervalHandlerAsArray & IntervalHandlerAsObject
}
