'use client'

import { Control, useController } from 'react-hook-form'
import { FormSection } from '@/components/ui/form/FormSection'
import { IconImage } from '@/components/ui/icons'
import { AvatarContainer } from '@/app/profile/AvatarContainer'
import type { FreeProfileMetadata } from '@/types/profile'
import { useState } from 'react'

interface CulinaryImagesSectionProps {
  control: Control<FreeProfileMetadata>
}

export function CulinaryImagesSection({ control }: CulinaryImagesSectionProps) {
  const [positions, setPositions] = useState([
    { x: 0, y: 0, scale: 1 },
    { x: 0, y: 0, scale: 1 },
    { x: 0, y: 0, scale: 1 },
  ])

  // We'll store the images in the culinaryInfo.specialties array for now
  // You might want to create a dedicated field for this in your schema
  const { field: specialtiesField } = useController({
    control,
    name: 'culinaryInfo.specialties',
    defaultValue: ['', '', ''],
  })

  const handleImageSelect = async (index: number, file: File) => {
    try {
      // TODO: Replace with your actual IPFS upload logic
      const fakeUrl = URL.createObjectURL(file)
      const newImages = [...(specialtiesField.value || ['', '', ''])]
      newImages[index] = fakeUrl
      specialtiesField.onChange(newImages)
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const handlePositionSet = (index: number, position: { x: number; y: number; scale: number }) => {
    const newPositions = [...positions]
    newPositions[index] = position
    setPositions(newPositions)
  }

  return (
    <FormSection
      title='Culinary Gallery'
      icon={<IconImage />}
      description='Add up to three images showcasing your culinary expertise'
    >
      <div className='grid grid-cols-1 gap-6'>
        {[0, 1, 2].map((index) => (
          <AvatarContainer
            key={index}
            imageUrl={specialtiesField.value?.[index] || null}
            onImageSelect={(file) => handleImageSelect(index, file)}
            onImagePositionSet={(position) => handlePositionSet(index, position)}
            size='lg'
            shape='square'
            label={`Culinary Image ${index + 1}`}
          />
        ))}
      </div>
    </FormSection>
  )
}
