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

export default function CulinaryInfoSection({ control, errors, isPro }: CulinaryInfoSectionProps) {
  return (
    <FormSection
      title='Culinary Information'
      icon={<IconChefHat className='w-5 h-5 text-github-fg-default' />}
      description='Tell us about your cooking experience'
    >
      <FormSelect
        control={control}
        name='culinaryInfo.expertise'
        label='Expertise Level'
        error={errors.culinaryInfo?.expertise?.message}
        options={[
          { value: 'beginner', label: 'Beginner' },
          { value: 'intermediate', label: 'Intermediate' },
          { value: 'advanced', label: 'Advanced' },
          { value: 'professional', label: 'Professional' },
        ]}
      />

      <FormMultiSelect
        control={control}
        name='culinaryInfo.specialties'
        label='Specialties'
        error={errors.culinaryInfo?.specialties?.message}
        options={[
          { value: 'baking', label: 'Baking' },
          { value: 'grilling', label: 'Grilling' },
          { value: 'pastry', label: 'Pastry' },
          { value: 'sauces', label: 'Sauces' },
          { value: 'seafood', label: 'Seafood' },
          { value: 'butchery', label: 'Butchery' },
          { value: 'fermentation', label: 'Fermentation' },
          { value: 'preservation', label: 'Food Preservation' },
        ]}
      />

      <FormMultiSelect
        control={control}
        name='culinaryInfo.dietaryPreferences'
        label='Dietary Preferences'
        error={errors.culinaryInfo?.dietaryPreferences?.message}
        options={[
          { value: 'vegetarian', label: 'Vegetarian' },
          { value: 'vegan', label: 'Vegan' },
          { value: 'gluten-free', label: 'Gluten Free' },
          { value: 'keto', label: 'Keto' },
          { value: 'paleo', label: 'Paleo' },
          { value: 'halal', label: 'Halal' },
          { value: 'kosher', label: 'Kosher' },
        ]}
      />

      <FormMultiSelect
        control={control}
        name='culinaryInfo.cuisineTypes'
        label='Cuisine Types'
        error={errors.culinaryInfo?.cuisineTypes?.message}
        options={[
          { value: 'italian', label: 'Italian' },
          { value: 'french', label: 'French' },
          { value: 'japanese', label: 'Japanese' },
          { value: 'chinese', label: 'Chinese' },
          { value: 'indian', label: 'Indian' },
          { value: 'mexican', label: 'Mexican' },
          { value: 'mediterranean', label: 'Mediterranean' },
          { value: 'american', label: 'American' },
        ]}
      />

      <FormMultiSelect
        control={control}
        name='culinaryInfo.techniques'
        label='Techniques'
        error={errors.culinaryInfo?.techniques?.message}
        options={[
          { value: 'sous-vide', label: 'Sous Vide' },
          { value: 'smoking', label: 'Smoking' },
          { value: 'fermentation', label: 'Fermentation' },
          { value: 'curing', label: 'Curing' },
          { value: 'molecular', label: 'Molecular Gastronomy' },
          { value: 'knife-skills', label: 'Knife Skills' },
          { value: 'bread-making', label: 'Bread Making' },
        ]}
      />

      <FormMultiSelect
        control={control}
        name='culinaryInfo.equipment'
        label='Equipment Proficiency'
        error={errors.culinaryInfo?.equipment?.message}
        options={[
          { value: 'sous-vide', label: 'Sous Vide Machine' },
          { value: 'smoker', label: 'Smoker' },
          { value: 'stand-mixer', label: 'Stand Mixer' },
          { value: 'food-processor', label: 'Food Processor' },
          { value: 'dehydrator', label: 'Dehydrator' },
          { value: 'immersion-blender', label: 'Immersion Blender' },
          { value: 'pressure-cooker', label: 'Pressure Cooker' },
        ]}
      />

      {isPro && (
        <FormMultiSelect
          control={control as Control<ProProfileMetadata>}
          name='culinaryInfo.certifications'
          label='Certifications'
          error={(errors as FieldErrors<ProProfileMetadata>).culinaryInfo?.certifications?.message}
          options={[
            { value: 'servsafe', label: 'ServSafe Certified' },
            { value: 'haccp', label: 'HACCP Certified' },
            { value: 'culinary-arts', label: 'Culinary Arts Degree' },
            { value: 'pastry-arts', label: 'Pastry Arts Degree' },
            { value: 'sommelier', label: 'Sommelier Certification' },
            { value: 'nutrition', label: 'Nutrition Certification' },
          ]}
        />
      )}
    </FormSection>
  )
}
