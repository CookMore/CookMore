'use client'

import { Control, FieldErrors } from 'react-hook-form'
import { FormSection } from '@/components/ui/form/FormSection'
import { FormArrayField } from '@/components/ui/form/FormArrayField'
import { FormInput } from '@/components/ui/form/FormInput'
import { IconLink } from '@/components/ui/icons'
import type { FreeProfileMetadata } from '@/types/profile'

interface SocialLinksSectionProps {
  control: Control<FreeProfileMetadata>
  errors: FieldErrors<FreeProfileMetadata>
}

export default function SocialLinksSection({ control, errors }: SocialLinksSectionProps) {
  return (
    <FormSection
      title='Social Links'
      icon={<IconLink />}
      description='Add your social media profiles'
    >
      <FormArrayField
        control={control}
        name='social.urls'
        label='Social Links'
        emptyValue=''
        renderField={(field, index) => (
          <FormInput
            control={control}
            name={`social.urls.${index}`}
            placeholder='https://'
            error={errors.social?.urls?.[index]?.message}
            helperText='Enter your social media profile URL'
          />
        )}
      />
    </FormSection>
  )
}
