import React, { useState } from 'react'
import MenuSection from './MenuSection'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const MenuBuilder: React.FC<{ sections: any; setSections: any }> = ({ sections, setSections }) => {
  const handleSelectItem = (item, sectionId) => {
    setSections((prevSections) => ({
      ...prevSections,
      [sectionId]: [...prevSections[sectionId], item],
    }))
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const { source, destination } = result
    const sourceItems = Array.from(sections[source.droppableId])
    const [removed] = sourceItems.splice(source.index, 1)
    const destItems = Array.from(sections[destination.droppableId])
    destItems.splice(destination.index, 0, removed)
    setSections({
      ...sections,
      [source.droppableId]: sourceItems,
      [destination.droppableId]: destItems,
    })
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className='p-6 bg-github-canvas-default text-github-fg-default rounded-lg shadow-lg border border-gray-200'>
        <h1 className='text-2xl font-bold mb-6'>Menu Builder</h1>
        {Object.keys(sections).map((sectionId) => (
          <Droppable key={sectionId} droppableId={sectionId}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <MenuSection
                  sectionId={sectionId}
                  title={sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
                >
                  {sections[sectionId].map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {item.name}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </MenuSection>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  )
}

export default MenuBuilder
