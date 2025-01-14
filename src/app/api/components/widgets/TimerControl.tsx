import React, { useState, useEffect } from 'react'
import TimerWidget from './TimerWidget'

interface TimerControlProps {
  initialTime: number
  isRunning: boolean
  onToggle: () => void
  onTimeUp: () => void
  itemName: string
}

export default function TimerControl({
  initialTime,
  isRunning,
  onToggle,
  onTimeUp,
  itemName,
}: TimerControlProps) {
  const [currentTime, setCurrentTime] = useState(initialTime)
  const [isWidgetOpen, setIsWidgetOpen] = useState(false)

  useEffect(() => {
    setCurrentTime(initialTime)
  }, [initialTime])

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined
    if (isRunning && currentTime > 0) {
      timer = setInterval(() => {
        setCurrentTime((prevTime) => prevTime - 1)
      }, 1000)
    } else if (currentTime === 0 && isRunning) {
      onToggle()
      onTimeUp()
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isRunning, currentTime, onToggle, onTimeUp])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className='flex flex-col items-center space-y-2'>
      <div className='flex items-center space-x-2'>
        <p className='text-github-fg-muted text-lg font-bold'>{formatTime(currentTime)}</p>
        <button
          onClick={onToggle}
          className={`px-3 py-1 ${isRunning ? 'bg-red-500' : 'bg-green-500'} text-white rounded-md`}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
      </div>
      <p className='text-github-fg-muted'>{itemName}</p>
      <button
        onClick={() => setIsWidgetOpen(!isWidgetOpen)}
        className='text-github-fg-default hover:text-github-fg-muted transition-colors'
      >
        {isWidgetOpen ? 'Close Timer Widget' : 'Open Timer Widget'}
      </button>
      {isWidgetOpen && <TimerWidget isInDashboard={false} />}
    </div>
  )
}
