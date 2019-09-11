import * as DF from 'date-fns'
import raf from 'raf'
import React from 'react'

import { useNow } from './useNow'
import { useStateRef } from './useStateRef'

export const SECOND = 1 * 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE

interface IOptions {
  interval: number
  enabled: boolean
  nextTick?(onTick: () => void): number
  cancelTick?(handle: number): void
}

/**
 * Hook to rerender component in timely fashion (uses rAF by default).
 *
 * Useful for eg. show countdown, stopwatch, clock, animations, etc...
 */
export const useTimer = ({
  interval,
  enabled,
  nextTick = raf,
  cancelTick = raf.cancel,
}: IOptions) => {
  const getNow = useNow()
  const [getLastUpdate, setLastUpdate] = useStateRef(getNow)
  const handleRef = React.useRef<number | null>(null)

  const onUpdate = React.useCallback(() => {
    if (!enabled) {
      return
    }
    const now = getNow()
    const last = getLastUpdate()
    const delta = DF.differenceInMilliseconds(now, last)
    if (delta >= interval) {
      setLastUpdate(now)
    }
  }, [enabled, getNow, getLastUpdate, interval, setLastUpdate])

  // in case component re-renders, let's check if interval was reached also
  React.useEffect(onUpdate)

  React.useEffect(() => {
    const onFrame = () => {
      onUpdate()
      loop()
    }

    const onStart = () => {
      loop()
    }

    const onStop = () => {
      if (handleRef.current) {
        cancelTick(handleRef.current)
        handleRef.current = null
      }
    }

    const loop = () => {
      if (enabled) {
        handleRef.current = nextTick(onFrame)
      } else {
        onStop()
      }
    }

    onStart()
    return onStop
  }, [interval, enabled, onUpdate, cancelTick, nextTick])

  return getLastUpdate()
}
