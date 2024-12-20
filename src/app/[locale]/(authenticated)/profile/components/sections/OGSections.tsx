import { useFormContext } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { FormSection } from '@/app/api/form/FormSection'
import { FormField } from '@/app/api/form/form'
import { FormSwitch } from '@/app/api/form/FormSwitch'
import { FormSelect } from '@/app/api/form/FormSelect'
import { IconStar, IconTrophy, IconUsers } from '@/app/api/icons'
import type { Control, FieldErrors } from 'react-hook-form'
import type { Theme } from '@/app/api/styles/themes'
import type { ProfileFormData } from '../../profile'

interface OGSectionProps {
  control: Control<ProfileFormData>
  errors: FieldErrors<ProfileFormData>
  theme: Theme
}

export function OGPreferencesSection({ control, errors, theme }: OGSectionProps) {
  const t = useTranslations('profile')

  return (
    <FormSection icon={IconStar} title={t('preferences')} theme={theme}>
      <div className='space-y-4'>
        <FormField
          control={control}
          name='preferences.exclusiveContent'
          render={({ field }) => (
            <FormSwitch
              label={t('exclusiveContent')}
              description={t('exclusiveContentDesc')}
              {...field}
            />
          )}
        />
        <FormField
          control={control}
          name='preferences.earlyAccess'
          render={({ field }) => (
            <FormSwitch label={t('earlyAccess')} description={t('earlyAccessDesc')} {...field} />
          )}
        />
        <FormField
          control={control}
          name='preferences.mentorship'
          render={({ field }) => (
            <FormSwitch label={t('mentorship')} description={t('mentorshipDesc')} {...field} />
          )}
        />
        <FormField
          control={control}
          name='preferences.theme'
          render={({ field }) => (
            <FormSelect
              label={t('theme')}
              options={[
                { value: 'default', label: t('themeDefault') },
                { value: 'dark', label: t('themeDark') },
                { value: 'light', label: t('themeLight') },
              ]}
              {...field}
            />
          )}
        />
      </div>
    </FormSection>
  )
}

export function OGShowcaseSection({ control, errors, theme }: OGSectionProps) {
  const t = useTranslations('profile')

  return (
    <FormSection icon={IconTrophy} title={t('showcase')} theme={theme}>
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>{t('featuredRecipes')}</label>
          <div className='space-y-2'>
            <p className='text-sm text-github-fg-muted'>{t('comingSoon')}</p>
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>{t('achievements')}</label>
          <div className='space-y-2'>
            <p className='text-sm text-github-fg-muted'>{t('comingSoon')}</p>
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>{t('contributions')}</label>
          <div className='space-y-2'>
            <p className='text-sm text-github-fg-muted'>{t('comingSoon')}</p>
          </div>
        </div>
      </div>
    </FormSection>
  )
}

export function OGNetworkSection({ control, errors, theme }: OGSectionProps) {
  const t = useTranslations('profile')

  return (
    <FormSection icon={IconUsers} title={t('network')} theme={theme}>
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>{t('connections')}</label>
          <div className='space-y-2'>
            <p className='text-sm text-github-fg-muted'>{t('comingSoon')}</p>
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>{t('collaborations')}</label>
          <div className='space-y-2'>
            <p className='text-sm text-github-fg-muted'>{t('comingSoon')}</p>
          </div>
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>{t('mentees')}</label>
          <div className='space-y-2'>
            <p className='text-sm text-github-fg-muted'>{t('comingSoon')}</p>
          </div>
        </div>
      </div>
    </FormSection>
  )
}
