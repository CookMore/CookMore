import React from 'react'

interface MenuPreviewProps {
  sections: {
    [key: string]: any[]
  }
}

const MenuPreview: React.FC<MenuPreviewProps> = ({ sections }) => {
  return (
    <div className='p-4 border border-gray-300 rounded-lg'>
      <h2 className='text-xl font-bold mb-4'>Menu Preview</h2>
      {Object.entries(sections).map(([sectionId, items]) => (
        <div key={sectionId} className='mb-4'>
          <h3 className='text-lg font-semibold'>
            {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
          </h3>
          <ul className='list-disc pl-5'>
            {items.map((item, index) => (
              <li key={index}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default MenuPreview
