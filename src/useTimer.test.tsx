import { renderHook } from '@testing-library/react-hooks'
import React from 'react'

import { FixedNowProvider } from './useNow'
import { useTimer } from './useTimer'

beforeEach(() => jest.useFakeTimers())
afterEach(() => {
  jest.useRealTimers()
})

it('returns current timestamp on mount', () => {
  const now = new Date()
  const { result } = renderHook(
    () => useTimer({ enabled: false, interval: 1 }),
    {
      wrapper: ({ children }) => (
        <FixedNowProvider date={now}>{children}</FixedNowProvider>
      ),
    },
  )
  expect(result.current).toBe(now)
})

it('runs tick only when enabled', () => {
  const handle = Math.random()
  const nextTick = jest.fn(() => handle)
  const cancelTick = jest.fn()
  const { rerender } = renderHook(
    ({ enabled }) => useTimer({ enabled, interval: 1, nextTick, cancelTick }),
    { initialProps: { enabled: false } },
  )
  expect(nextTick).toHaveBeenCalledTimes(1)
  expect(cancelTick).not.toHaveBeenCalled()

  rerender({ enabled: false })
  expect(nextTick).toHaveBeenCalledTimes(1)
  expect(cancelTick).toHaveBeenCalledTimes(1)
  expect(cancelTick).toHaveBeenCalledWith(handle)
})

// it('updates timestamp after specified interval has passed', () => {
//   let renderCount = 0
//   const getNow = jest.fn(() => 0)
//   const rafStub = createStub()
//   const TimedComponent = () => {
//     renderCount += 1
//     const now = useTimer({
//       interval: 50,
//       enabled: true,
//       getNow,
//       nextTick: rafStub.add,
//       cancelTick: rafStub.remove,
//     })
//     return <div>{now}</div>
//   }
//   const { container, rerender } = render(<TimedComponent />)
//   const next = time => {
//     getNow.mockReturnValue(time)
//     rerender(<TimedComponent />)
//     renderCount -= 1
//     rafStub.step()
//     rerender(<TimedComponent />)
//     renderCount -= 1
//   }
//   expect(container.textContent).toBe('0')
//   expect(renderCount).toBe(1)
//   next(25)
//   expect(container.textContent).toBe('0')
//   expect(renderCount).toBe(1)
//   next(60)
//   expect(container.textContent).toBe('60')
//   expect(renderCount).toBe(2)
//   next(95)
//   expect(container.textContent).toBe('60')
//   expect(renderCount).toBe(2)
//   next(110)
//   expect(container.textContent).toBe('110')
//   expect(renderCount).toBe(3)
// })
