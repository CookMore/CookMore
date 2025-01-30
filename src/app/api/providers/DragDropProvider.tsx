import React from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'

interface DragDropProviderProps {
  children: React.ReactNode
}

const DragDropProvider: React.FC<DragDropProviderProps> = ({ children }) => {
  const onDragEnd = (result: DropResult) => {
    // Handle the drag-and-drop result here
    console.log('Drag ended:', result)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId='droppable-area'
        isDropDisabled={false}
        isCombineEnabled={false}
        ignoreContainerClipping={false}
      >
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {children}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default DragDropProvider
