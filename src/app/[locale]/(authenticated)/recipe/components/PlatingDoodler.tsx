import React, { useRef, useState, useEffect } from 'react'
import { CirclePicker } from 'react-color'

// Define a new SVG icon for the color wheel
const ColorWheelIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className='w-6 h-6 ml-2 text-gray-500'
  >
    <circle cx='12' cy='12' r='10' />
    <path d='M15.9 9a5 5 0 0 1-6.9 6.9' />
    <path d='M9 15.9a5 5 0 0 1 6.9-6.9' />
    <line x1='9' y1='9' x2='9.01' y2='9' />
    <line x1='15' y1='15' x2='15.01' y2='15' />
  </svg>
)

export function PlatingDoodler() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [brushSize, setBrushSize] = useState(5)
  const [brushColor, setBrushColor] = useState('#000000')
  const [isEraserActive, setIsEraserActive] = useState(false)
  const [canvasBgColor, setCanvasBgColor] = useState(
    getComputedStyle(document.documentElement).getPropertyValue('--canvas-default')
  )

  useEffect(() => {
    const updateCanvasBgColor = () => {
      const newColor = getComputedStyle(document.documentElement).getPropertyValue(
        '--canvas-default'
      )
      setCanvasBgColor(newColor)
    }
    window.addEventListener('themechange', updateCanvasBgColor)
    updateCanvasBgColor()
    return () => window.removeEventListener('themechange', updateCanvasBgColor)
  }, [])

  const defaultColors = [
    '#000000',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
  ]

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.strokeStyle = isEraserActive ? canvasBgColor : brushColor
    ctx.beginPath()
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const toggleEraser = () => {
    setIsEraserActive(!isEraserActive)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const drawShape = (shape: string) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = isEraserActive ? canvasBgColor : brushColor
    ctx.clearRect(0, 0, canvas.width, canvas.height) // Clear canvas before drawing
    switch (shape) {
      case 'circle':
        ctx.beginPath()
        ctx.arc(250, 250, 80, 0, Math.PI * 2) // Fixed radius
        ctx.fill()
        break
      case 'half-circle':
        ctx.beginPath()
        ctx.arc(250, 250, 80, 0, Math.PI) // Fixed radius
        ctx.fill()
        break
      case 'martini':
        ctx.beginPath()
        ctx.moveTo(220, 400)
        ctx.lineTo(280, 400)
        ctx.lineTo(250, 350)
        ctx.closePath()
        ctx.fill()
        break
      case 'square':
        ctx.fillRect(200, 200, 100, 100) // Fixed side length
        break
      case 'rectangle':
        ctx.fillRect(175, 225, 150, 75) // Fixed width and height
        break
      default:
        break
    }
  }

  return (
    <div className='plating-doodler mt-8 mx-auto max-w-lg p-4 flex flex-col items-center'>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className='border border-gray-300 mx-auto'
        style={{ backgroundColor: canvasBgColor }}
      />
      <div className='shape-menu mt-4 flex justify-center space-x-4'>
        <button
          onClick={() => drawShape('circle')}
          className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Circle
        </button>
        <button
          onClick={() => drawShape('half-circle')}
          className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Half Circle
        </button>
        <button
          onClick={() => drawShape('martini')}
          className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Martini
        </button>
        <button
          onClick={() => drawShape('square')}
          className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Square
        </button>
        <button
          onClick={() => drawShape('rectangle')}
          className='p-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        >
          Rectangle
        </button>
      </div>
      <div className='brush-controls mt-4 text-center border border-gray-300 mx-auto p-8'>
        <label className='block mb-2'>Brush Size:</label>
        <input
          type='range'
          min='1'
          max='20'
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className='w-full mb-4'
        />
        <label className='block mb-2'>Brush Color:</label>
        <div className='flex items-center justify-center space-x-3 mt-8 mb-8 mx-auto'>
          <CirclePicker color={brushColor} onChangeComplete={(color) => setBrushColor(color.hex)} />
          <input
            type='color'
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            className='w-10 h-10 cursor-pointer'
          />
        </div>
        <button
          onClick={toggleEraser}
          className={`w-full py-2 mb-4 ${isEraserActive ? 'bg-gray-600' : 'bg-gray-400'} border border-gray-500 rounded-md`}
        >
          {isEraserActive ? 'Disable Eraser' : 'Eraser'}
        </button>
        <button onClick={clearCanvas} className='w-full py-2 bg-red-500 text-white rounded-md'>
          Clear Canvas
        </button>
      </div>
    </div>
  )
}
