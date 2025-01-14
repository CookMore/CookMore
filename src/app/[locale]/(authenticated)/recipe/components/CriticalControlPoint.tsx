import { useState } from 'react'
import { ModularHaccpPlan } from './ModularHaccpPlan'

interface CriticalControlPointProps {
  onAdd: (ccp: { note: string }) => void
}

export function CriticalControlPoint({ onAdd }: CriticalControlPointProps) {
  const [note, setNote] = useState('')

  const handleAdd = () => {
    if (note.trim()) {
      onAdd({ note })
      setNote('')
    }
  }

  return (
    <div className='p-4 bg-github-canvas-subtle rounded-md'>
      <h4 className='text-md font-semibold mb-2'>Add Critical Control Point</h4>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className='w-full px-3 py-2 bg-github-canvas-default border border-github-border-default rounded-md'
        rows={3}
        placeholder='Enter a short note for the CCP...'
      />
      <button
        onClick={handleAdd}
        className='mt-2 px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white active:bg-red-600 active:border-white transition-colors duration-200'
      >
        Add CCP
      </button>

      <ModularHaccpPlan onSelect={(selectedCcp) => onAdd({ note: selectedCcp })} />
    </div>
  )
}
