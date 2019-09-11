import React from 'react'

const context = React.createContext(() => new Date())

/**
 * Simple hook providing a function that returns current Date.
 *
 * True power lies in utilizing Context and allowing to override
 * behavior in tests.
 */
export function useNow() {
  return React.useContext(context)
}

/**
 * Overrides useNow() to return specific Date
 */
export const FixedNowProvider: React.FC<{ date: Date }> = ({
  date,
  children,
}) => {
  return React.createElement(context.Provider, { value: () => date }, children)
}

/**
 * Override useNow() to return dynamically updated Date.
 *
 * Returns tuple of provider element with attached date value
 * and setter function to change the date
 */
export function useDynamicNow(initialDate: Date = new Date()) {
  const [value, setValue] = React.useState(initialDate)
  const nowProvider = React.createElement(FixedNowProvider, { date: value })
  return [nowProvider, setValue] as [typeof nowProvider, typeof setValue]
}
