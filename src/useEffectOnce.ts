import React from 'react'

/**
 * Ensure the effect is executed only once.
 * Instead of tracking changed deps, it uses ref internally to remember
 * if effect was executed.
 */
export function useEffectOnce(effect: React.EffectCallback) {
  const hasRun = React.useRef(false)
  React.useEffect(() => {
    if (hasRun.current) {
      return
    }
    hasRun.current = true
    return effect()
  })
}
