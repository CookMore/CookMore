import React, { useState } from 'react'

const SearchResultItem: React.FC<{
  item: any
  onAddToMenu: (item: any, sectionId: string) => void
}> = ({ item, onAddToMenu }) => {
  const [showPopover, setShowPopover] = useState(false)

  const handleAddClick = () => {
    setShowPopover(true)
  }

  const handleSectionSelect = (sectionId: string) => {
    onAddToMenu(item, sectionId)
    setShowPopover(false)
  }

  return (
    <div className='search-result-item'>
      <div>{item.name}</div>
      <button onClick={handleAddClick}>Add to Menu</button>
      {showPopover && (
        <div
          className='popover'
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px',
            zIndex: 1000,
          }}
        >
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {['soup', 'salad', 'bread', 'appetizer', 'main-course', 'dessert'].map((sectionId) => (
              <li
                key={sectionId}
                onClick={() => handleSectionSelect(sectionId)}
                style={{ cursor: 'pointer', padding: '5px 0' }}
              >
                {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SearchResultItem
