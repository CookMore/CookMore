'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormSelect } from '@/components/ui/form/FormSelect'
import { FormMultiSelect } from '@/components/ui/form/FormMultiSelect'
import { IconChefHat } from '@/components/ui/icons'
import type { FreeProfileMetadata, ProProfileMetadata, GroupProfileMetadata } from '@/types/profile'

type ProfileFormData = FreeProfileMetadata | ProProfileMetadata | GroupProfileMetadata

interface CulinaryInfoSectionProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  isPro?: boolean
}

const EXPERTISE_OPTIONS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'professional', label: 'Professional' },
]

const SPECIALTIES_OPTIONS = [
  { value: 'baking', label: 'Baking' },
  { value: 'grilling', label: 'Grilling' },
  { value: 'pastry', label: 'Pastry' },
  { value: 'sauces', label: 'Sauces' },
  { value: 'seafood', label: 'Seafood' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'fermentation', label: 'Fermentation' },
]

const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
  { value: 'halal', label: 'Halal' },
  { value: 'kosher', label: 'Kosher' },
]

const CUISINE_OPTIONS = [
  { value: 'italian', label: 'Italian' },
  { value: 'french', label: 'French' },
  { value: 'japanese', label: 'Japanese' },
  { value: 'chinese', label: 'Chinese' },
  { value: 'indian', label: 'Indian' },
  { value: 'mexican', label: 'Mexican' },
  { value: 'thai', label: 'Thai' },
  { value: 'mediterranean', label: 'Mediterranean' },
]

const TECHNIQUES_OPTIONS = [
  { value: 'sous-vide', label: 'Sous Vide' },
  { value: 'smoking', label: 'Smoking' },
  { value: 'fermentation', label: 'Fermentation' },
  { value: 'molecular-gastronomy', label: 'Molecular Gastronomy' },
  { value: 'knife-skills', label: 'Knife Skills' },
  { value: 'butchery', label: 'Butchery' },
  { value: 'bread-making', label: 'Bread Making' },
  { value: 'pastry-techniques', label: 'Pastry Techniques' },
]

const EQUIPMENT_OPTIONS = [
  { value: 'sous-vide', label: 'Sous Vide Machine' },
  { value: 'smoker', label: 'Smoker' },
  { value: 'stand-mixer', label: 'Stand Mixer' },
  { value: 'food-processor', label: 'Food Processor' },
  { value: 'dehydrator', label: 'Dehydrator' },
  { value: 'immersion-blender', label: 'Immersion Blender' },
  { value: 'pressure-cooker', label: 'Pressure Cooker' },
  { value: 'pizza-oven', label: 'Pizza Oven' },
]

export function CulinaryInfoSection({ control, errors, isPro }: CulinaryInfoSectionProps) {
  return (
    <FormSection icon={IconChefHat} title='Culinary Information'>
      <div className='space-y-6'>
        <FormSelect
          control={control}
          name='culinaryInfo.expertise'
          label='Expertise Level'
          placeholder='Select your expertise level'
          options={EXPERTISE_OPTIONS}
          error={errors.culinaryInfo?.expertise?.message}
        />

        <FormMultiSelect
          control={control}
          name='culinaryInfo.specialties'
          label='Specialties'
          placeholder='Select your specialties'
          options={SPECIALTIES_OPTIONS}
          error={errors.culinaryInfo?.specialties?.message}
        />

        <FormMultiSelect
          control={control}
          name='culinaryInfo.dietaryPreferences'
          label='Dietary Preferences'
          placeholder='Select dietary preferences'
          options={DIETARY_OPTIONS}
          error={errors.culinaryInfo?.dietaryPreferences?.message}
        />

        <FormMultiSelect
          control={control}
          name='culinaryInfo.cuisineTypes'
          label='Cuisine Types'
          placeholder='Select cuisine types'
          options={CUISINE_OPTIONS}
          error={errors.culinaryInfo?.cuisineTypes?.message}
        />

        {isPro && (
          <>
            <FormMultiSelect
              control={control}
              name='culinaryInfo.techniques'
              label='Techniques'
              placeholder='Select your techniques'
              options={TECHNIQUES_OPTIONS}
              error={errors.culinaryInfo?.techniques?.message}
            />

            <FormMultiSelect
              control={control}
              name='culinaryInfo.equipment'
              label='Equipment'
              placeholder='Select your equipment'
              options={EQUIPMENT_OPTIONS}
              error={errors.culinaryInfo?.equipment?.message}
            />
          </>
        )}
      </div>
    </FormSection>
  )
}
