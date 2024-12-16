'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { FormSection } from '@/app/api/form/FormSection'
import { FormSelect } from '@/app/api/form/FormSelect'
import { FormMultiSelect } from '@/app/api/form/FormMultiSelect'
import { IconChefHat } from '@/app/api/icons'
import { useTheme } from 'next-themes'
import type { ProfileFormData } from '@/app/[locale]/(authenticated)/profile/profile'

interface CulinaryInfoSectionProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  isPro?: boolean
}

type ExpertiseLevel = 'beginner' | 'intermediate' | 'advanced' | 'professional'

const EXPERTISE_OPTIONS: Array<{ value: ExpertiseLevel; label: string }> = [
  { value: 'beginner', label: 'form.culinaryInfo.expertise.beginner' },
  { value: 'intermediate', label: 'form.culinaryInfo.expertise.intermediate' },
  { value: 'advanced', label: 'form.culinaryInfo.expertise.advanced' },
  { value: 'professional', label: 'form.culinaryInfo.expertise.professional' },
]

const SPECIALTIES_OPTIONS = [
  { value: 'baking', label: 'form.culinaryInfo.specialties.baking' },
  { value: 'grilling', label: 'form.culinaryInfo.specialties.grilling' },
  { value: 'pastry', label: 'form.culinaryInfo.specialties.pastry' },
  { value: 'sauces', label: 'form.culinaryInfo.specialties.sauces' },
  { value: 'seafood', label: 'form.culinaryInfo.specialties.seafood' },
  { value: 'vegan', label: 'form.culinaryInfo.specialties.vegan' },
  { value: 'desserts', label: 'form.culinaryInfo.specialties.desserts' },
  { value: 'fermentation', label: 'form.culinaryInfo.specialties.fermentation' },
]

const DIETARY_OPTIONS = [
  { value: 'vegetarian', label: 'form.culinaryInfo.dietary.vegetarian' },
  { value: 'vegan', label: 'form.culinaryInfo.dietary.vegan' },
  { value: 'gluten-free', label: 'form.culinaryInfo.dietary.glutenFree' },
  { value: 'dairy-free', label: 'form.culinaryInfo.dietary.dairyFree' },
  { value: 'keto', label: 'form.culinaryInfo.dietary.keto' },
  { value: 'paleo', label: 'form.culinaryInfo.dietary.paleo' },
  { value: 'halal', label: 'form.culinaryInfo.dietary.halal' },
  { value: 'kosher', label: 'form.culinaryInfo.dietary.kosher' },
]

const CUISINE_OPTIONS = [
  { value: 'italian', label: 'form.culinaryInfo.cuisine.italian' },
  { value: 'french', label: 'form.culinaryInfo.cuisine.french' },
  { value: 'japanese', label: 'form.culinaryInfo.cuisine.japanese' },
  { value: 'chinese', label: 'form.culinaryInfo.cuisine.chinese' },
  { value: 'indian', label: 'form.culinaryInfo.cuisine.indian' },
  { value: 'mexican', label: 'form.culinaryInfo.cuisine.mexican' },
  { value: 'thai', label: 'form.culinaryInfo.cuisine.thai' },
  { value: 'mediterranean', label: 'form.culinaryInfo.cuisine.mediterranean' },
]

const TECHNIQUES_OPTIONS = [
  { value: 'sous-vide', label: 'form.culinaryInfo.techniques.sousVide' },
  { value: 'smoking', label: 'form.culinaryInfo.techniques.smoking' },
  { value: 'fermentation', label: 'form.culinaryInfo.techniques.fermentation' },
  { value: 'molecular-gastronomy', label: 'form.culinaryInfo.techniques.molecularGastronomy' },
  { value: 'knife-skills', label: 'form.culinaryInfo.techniques.knifeSkills' },
  { value: 'butchery', label: 'form.culinaryInfo.techniques.butchery' },
  { value: 'bread-making', label: 'form.culinaryInfo.techniques.breadMaking' },
  { value: 'pastry-techniques', label: 'form.culinaryInfo.techniques.pastryTechniques' },
]

const EQUIPMENT_OPTIONS = [
  { value: 'sous-vide', label: 'form.culinaryInfo.equipment.sousVide' },
  { value: 'smoker', label: 'form.culinaryInfo.equipment.smoker' },
  { value: 'stand-mixer', label: 'form.culinaryInfo.equipment.standMixer' },
  { value: 'food-processor', label: 'form.culinaryInfo.equipment.foodProcessor' },
  { value: 'dehydrator', label: 'form.culinaryInfo.equipment.dehydrator' },
  { value: 'immersion-blender', label: 'form.culinaryInfo.equipment.immersionBlender' },
  { value: 'pressure-cooker', label: 'form.culinaryInfo.equipment.pressureCooker' },
  { value: 'pizza-oven', label: 'form.culinaryInfo.equipment.pizzaOven' },
]

export function CulinaryInfoSection({ control, errors, isPro }: CulinaryInfoSectionProps) {
  const t = useTranslations()
  const { theme } = useTheme()

  const getTranslatedOptions = (options: Array<{ value: string; label: string }>) => {
    return options.map((option) => ({
      value: option.value,
      label: t(option.label),
    }))
  }

  return (
    <FormSection icon={IconChefHat} title={t('form.culinaryInfo.title')} theme={theme}>
      <div className='space-y-6'>
        <FormSelect
          control={control}
          name='culinaryInfo.expertise'
          label={t('form.culinaryInfo.expertise.label')}
          placeholder={t('form.culinaryInfo.expertise.placeholder')}
          options={getTranslatedOptions(EXPERTISE_OPTIONS)}
          error={errors.culinaryInfo?.expertise?.message}
          theme={theme}
        />

        <FormMultiSelect
          control={control}
          name='culinaryInfo.specialties'
          label={t('form.culinaryInfo.specialties.label')}
          placeholder={t('form.culinaryInfo.specialties.placeholder')}
          options={getTranslatedOptions(SPECIALTIES_OPTIONS)}
          error={errors.culinaryInfo?.specialties?.message}
          theme={theme}
        />

        <FormMultiSelect
          control={control}
          name='culinaryInfo.dietaryPreferences'
          label={t('form.culinaryInfo.dietary.label')}
          placeholder={t('form.culinaryInfo.dietary.placeholder')}
          options={getTranslatedOptions(DIETARY_OPTIONS)}
          error={errors.culinaryInfo?.dietaryPreferences?.message}
          theme={theme}
        />

        <FormMultiSelect
          control={control}
          name='culinaryInfo.cuisineTypes'
          label={t('form.culinaryInfo.cuisine.label')}
          placeholder={t('form.culinaryInfo.cuisine.placeholder')}
          options={getTranslatedOptions(CUISINE_OPTIONS)}
          error={errors.culinaryInfo?.cuisineTypes?.message}
          theme={theme}
        />

        {isPro && (
          <>
            <FormMultiSelect
              control={control}
              name='culinaryInfo.techniques'
              label={t('form.culinaryInfo.techniques.label')}
              placeholder={t('form.culinaryInfo.techniques.placeholder')}
              options={getTranslatedOptions(TECHNIQUES_OPTIONS)}
              error={errors.culinaryInfo?.techniques?.message}
              theme={theme}
            />

            <FormMultiSelect
              control={control}
              name='culinaryInfo.equipment'
              label={t('form.culinaryInfo.equipment.label')}
              placeholder={t('form.culinaryInfo.equipment.placeholder')}
              options={getTranslatedOptions(EQUIPMENT_OPTIONS)}
              error={errors.culinaryInfo?.equipment?.message}
              theme={theme}
            />
          </>
        )}
      </div>
    </FormSection>
  )
}
