'use client'

import React, { useState } from 'react'
import TimerControl from './TimerControl'
import { useTimer } from './useTimer'
import useSound from 'use-sound'
import alarm1 from '@/app/api/sounds/alarm1.aac'
import alarm2 from '@/app/api/sounds/alarm2.aac'
import alarm3 from '@/app/api/sounds/alarm3.aac'
import { IconVolume2, IconVolume } from '@tabler/icons-react'

const categories = {
  Eggs: [
    { name: 'Soft-Boiled Egg', time: 360 },
    { name: 'Hard-Boiled Egg', time: 600 },
    { name: 'Poached Egg', time: 240 },
    { name: 'Frying Eggs Sunny-Side Up', time: 180 },
    { name: 'Frying Eggs Over Easy', time: 300 },
    { name: 'Scrambling Eggs', time: 300 },
    { name: 'Baking Eggs in a Muffin Tin', time: 1200 },
    { name: 'Making Omelet', time: 420 },
    { name: 'Cooling Hard-Cooked Eggs Before Peeling', time: 300 },
    { name: 'Cooking Deviled Egg Filling', time: 900 },
  ],
  Baking: [
    { name: 'Baking Chocolate Chip Cookies', time: 660 },
    { name: 'Baking a Sponge Cake', time: 1800 },
    { name: 'Baking Brownies', time: 1500 },
    { name: 'Baking Muffins', time: 1200 },
    { name: 'Baking Biscuits', time: 900 },
    { name: 'Proofing Bread Dough (First Rise)', time: 3600 },
    { name: 'Letting Dough Rest After Kneading', time: 900 },
    { name: 'Chilling Cookie Dough', time: 1800 },
    { name: 'Toasting Nuts in Oven', time: 480 },
    { name: 'Chilling Cheesecake After Baking', time: 14400 },
  ],
  GrainsAndStarches: [
    { name: 'Cooking Pasta (Spaghetti)', time: 600 },
    { name: 'Cooking Lasagna Sheets', time: 480 },
    { name: 'Simmering Jasmine Rice', time: 720 },
    { name: 'Simmering Quinoa', time: 900 },
    { name: 'Simmering Polenta', time: 1800 },
    { name: 'Cooking Couscous', time: 300 },
    { name: 'Cooking Mashed Potatoes', time: 900 },
    { name: 'Cooking Basmati Rice', time: 1080 },
    { name: 'Making Risotto', time: 1500 },
    { name: 'Steaming Sweet Potatoes', time: 900 },
  ],
  MeatAndFish: [
    { name: 'Grilling Steak (Medium-Rare)', time: 360 },
    { name: 'Broiling Salmon Fillet', time: 480 },
    { name: 'Resting Roasted Chicken', time: 900 },
    { name: 'Roasting Pork Tenderloin', time: 1500 },
    { name: 'Pan-Seared Chicken Breast', time: 480 },
    { name: 'Simmering Chicken for Soup', time: 1800 },
    { name: 'Baking Fish Fillets', time: 720 },
    { name: 'Slow-Cooking Beef Stew', time: 14400 },
    { name: 'Making Meatballs in the Oven', time: 1200 },
    { name: 'Resting Steak After Grilling', time: 600 },
  ],
  DoughAndYeast: [
    { name: 'Proofing Pizza Dough (First Rise)', time: 3600 },
    { name: 'Letting Yeast Bloom in Water', time: 420 },
    { name: 'Chilling Puff Pastry Dough', time: 1800 },
    { name: 'Rolling and Resting Pie Dough', time: 900 },
    { name: 'Second Rise for Bread Dough', time: 2700 },
    { name: 'Stretching Pizza Dough', time: 600 },
    { name: 'Proofing Cinnamon Rolls', time: 3600 },
    { name: 'Resting Scone Dough Before Baking', time: 1200 },
    { name: 'Baking Yeast Rolls', time: 1200 },
    { name: 'Freezing Dough for Storage', time: 900 },
  ],
  Beverages: [
    { name: 'Brewing Green Tea', time: 180 },
    { name: 'Brewing Black Tea', time: 300 },
    { name: 'Brewing Herbal Tea', time: 420 },
    { name: 'Brewing French Press Coffee', time: 240 },
    { name: 'Boiling Water for Tea', time: 180 },
    { name: 'Steeping Cold Brew Coffee', time: 43200 },
    { name: 'Warming Milk for Latte', time: 120 },
    { name: 'Infusing Fruit Water', time: 1800 },
    { name: 'Cooling Brewed Coffee for Iced Coffee', time: 600 },
    { name: 'Simmering Mulled Wine', time: 1200 },
  ],
  SnacksAndShortTasks: [
    { name: 'Microwave Popcorn', time: 150 },
    { name: 'Cooking Pancakes', time: 240 },
    { name: 'Making Grilled Cheese', time: 300 },
    { name: 'Reheating Leftovers in Microwave', time: 180 },
    { name: 'Melting Chocolate in Microwave', time: 60 },
    { name: 'Softening Butter in Microwave', time: 15 },
    { name: 'Making Ramen Noodles', time: 240 },
    { name: 'Boiling Hot Dogs', time: 300 },
    { name: 'Heating Soup', time: 600 },
    { name: 'Baking Nachos in Oven', time: 480 },
  ],
  RoastingAndMiscellaneous: [
    { name: 'Roasting Sweet Potatoes (Cubed)', time: 1800 },
    { name: 'Roasting Brussels Sprouts', time: 1500 },
    { name: 'Roasting Chicken Breast', time: 1200 },
    { name: 'Roasting Carrots', time: 1500 },
    { name: 'Roasting Cauliflower', time: 1200 },
    { name: 'Roasting Asparagus', time: 600 },
    { name: 'Broiling Vegetables', time: 480 },
    { name: 'Cooking Bacon in Oven', time: 1200 },
    { name: 'Baking a Potato', time: 2700 },
    { name: 'Roasting Garlic', time: 2400 },
  ],
}

export default function TimerWidget({ isInDashboard = true }) {
  const { time, isRunning, startTimer, stopTimer, resetTimer } = useTimer({
    initialTime: 0,
    onTimeUp: () => {
      if (selectedAlarm === 'alarm1') play80s()
      else if (selectedAlarm === 'alarm2') playAlert()
      else if (selectedAlarm === 'alarm3') playClassic()
      alert('Time is up!')
    },
  })

  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categories>('Eggs')
  const [searchTerm, setSearchTerm] = useState('')
  const [input, setInput] = useState<string>('')
  const [suggestion, setSuggestion] = useState<string>('')
  const [selectedAlarm, setSelectedAlarm] = useState<string>('alarm1')
  const [playingAlarm, setPlayingAlarm] = useState<string | null>(null)

  const [play80s, { stop: stop80s }] = useSound(alarm1)
  const [playAlert, { stop: stopAlert }] = useSound(alarm2)
  const [playClassic, { stop: stopClassic }] = useSound(alarm3)

  const handleToggleTimer = () => {
    if (isRunning) {
      stopTimer()
    } else {
      startTimer()
    }
  }

  const handlePresetSelect = (presetTime: number) => {
    resetTimer()
    startTimer()
  }

  const handleGetSuggestion = async () => {
    try {
      const response = await fetch('/api/getCookingTime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ item: input }),
      })

      const data = await response.json()
      setSuggestion(data.suggestion)
    } catch (error) {
      console.error('Error getting timer suggestion:', error)
      setSuggestion('Failed to get suggestion')
    }
  }

  const toggleAlarmSound = (alarm: string) => {
    if (playingAlarm === alarm) {
      stopAlarmSound(alarm)
      setPlayingAlarm(null)
    } else {
      stopAllSounds()
      playAlarmSound(alarm)
      setPlayingAlarm(alarm)
    }
  }

  const playAlarmSound = (alarm: string) => {
    if (alarm === 'alarm1') play80s()
    else if (alarm === 'alarm2') playAlert()
    else if (alarm === 'alarm3') playClassic()
  }

  const stopAlarmSound = (alarm: string) => {
    if (alarm === 'alarm1') stop80s()
    else if (alarm === 'alarm2') stopAlert()
    else if (alarm === 'alarm3') stopClassic()
  }

  const stopAllSounds = () => {
    stop80s()
    stopAlert()
    stopClassic()
  }

  const filteredItems = categories[selectedCategory].filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div
      className={`p-2 border border-github-border-default shadow-lg rounded-md bg-github-canvas-default ${
        isInDashboard ? '' : 'w-64'
      }`}
    >
      <div className='p-2'>
        <div className='flex items-center justify-between mb-4'>
          <TimerControl
            initialTime={time}
            isRunning={isRunning}
            onToggle={handleToggleTimer}
            onTimeUp={() => {}}
            itemName={input}
          />
        </div>
        <div className='mb-2'>
          <label className='block text-github-fg-default mb-1'>Select Alarm Sound:</label>
          <div className='flex space-x-2'>
            {['alarm1', 'alarm2', 'alarm3'].map((alarm) => (
              <div key={alarm} className='flex items-center'>
                <button
                  onClick={() => setSelectedAlarm(alarm)}
                  className={`px-3 py-1 rounded-md ${selectedAlarm === alarm ? 'bg-github-btn-hover' : 'bg-github-btn-bg'} text-github-fg-default`}
                >
                  {alarm === 'alarm1' ? "80's" : alarm === 'alarm2' ? 'Alert' : 'Classic'}
                </button>
                <button
                  onClick={() => toggleAlarmSound(alarm)}
                  className='ml-2 text-github-fg-default hover:text-github-fg-muted transition-colors'
                >
                  {playingAlarm === alarm ? <IconVolume /> : <IconVolume2 />}
                </button>
              </div>
            ))}
          </div>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='Search...'
            className='w-full mb-1 px-3 py-1 bg-github-canvas-subtle text-github-fg-default border border-github-border-default rounded-md'
          />
          <div className='flex space-x-1 mb-1 overflow-x-auto'>
            {Object.keys(categories).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category as keyof typeof categories)}
                className={`px-3 py-1 rounded-md ${selectedCategory === category ? 'bg-github-btn-hover' : 'bg-github-btn-bg'} text-github-fg-default`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className='overflow-y-auto max-h-32'>
            {filteredItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handlePresetSelect(item.time)}
                className='block w-full text-left px-3 py-1 bg-github-canvas-default text-github-fg-default border-b border-github-border-default hover:bg-github-btn-hover'
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className='p-2 bg-github-canvas-subtle rounded-md mb-2'>
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Enter item to cook'
            className='w-full mb-2 px-3 py-1 bg-github-canvas-subtle text-github-fg-default border border-github-border-default rounded-md'
          />
          <button
            onClick={handleGetSuggestion}
            className='w-full mb-2 px-3 py-1 bg-github-btn-bg text-github-fg-default rounded-md transition-transform duration-200 hover:scale-105 hover:bg-github-btn-hover'
          >
            Get Timer Suggestion
          </button>
          <p className='text-github-fg-muted mb-2'>Suggested Timer: {suggestion}</p>
        </div>
      </div>
    </div>
  )
}
