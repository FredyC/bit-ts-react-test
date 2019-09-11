import React from 'react'

/**
 * Hook for debugging purposes to log if component was mounted and unmounted.
 * It uses `console.count` to log amount of remounts
 */
export function useMountLog(name: string) {
  React.useEffect(() => {
    console.count(`MOUNT ${name}`)
    return () => console.count(`UNMOUNT ${name}`)
  }, [name])
}
