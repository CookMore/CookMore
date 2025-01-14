import React, { createContext, useContext, useState, ReactNode } from 'react'

interface TimerContextProps {
  time: number
  setTime: (time: number) => void
  isRunning: boolean
  setIsRunning: (isRunning: boolean) => void
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined)

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [time, setTime] = useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  return (
    <TimerContext.Provider value={{ time, setTime, isRunning, setIsRunning }}>
      {children}
    </TimerContext.Provider>
  )
}

export const useTimer = () => {
  const context = useContext(TimerContext)
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider')
  }
  return context
}
