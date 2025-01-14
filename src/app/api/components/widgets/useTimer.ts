import { useState, useEffect } from 'react'

interface UseTimerProps {
  initialTime: number
  onTimeUp: () => void
}

export const useTimer = ({ initialTime, onTimeUp }: UseTimerProps) => {
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (time === 0 && isRunning) {
      onTimeUp()
      setIsRunning(false)
    }

    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [isRunning, time, onTimeUp])

  const startTimer = () => setIsRunning(true)
  const stopTimer = () => setIsRunning(false)
  const resetTimer = () => {
    setTime(initialTime)
    setIsRunning(false)
  }

  return {
    time,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
  }
}
