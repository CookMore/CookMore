import React from 'react'
import { Droppable } from 'react-beautiful-dnd'

interface MenuSectionProps {
  sectionId: string
  title: string
  children: React.ReactNode
}

const MenuSection: React.FC<MenuSectionProps> = ({ sectionId, title, children }) => {
  return (
    <Droppable droppableId={sectionId}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className='p-4 bg-github-canvas-subtle rounded-lg shadow-md border border-gray-200 mb-4'
        >
          <h2 className='text-lg font-bold mb-2'>{title}</h2>
          <div className='space-y-2'>
            {children}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}

export default MenuSection
