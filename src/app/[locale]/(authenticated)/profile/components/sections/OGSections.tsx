import { useFormContext } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { ProfileFormData } from '../../profile'

interface OGSectionProps {
  control: any
  errors: any
}

export function OGPreferencesSection({ control, errors }: OGSectionProps) {
  const t = useTranslations('profile')
  const { register } = useFormContext<ProfileFormData>()

  return (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-1'>{t('exclusiveContent')}</label>
        <input
          type='checkbox'
          {...register('ogPreferences.exclusiveContent')}
          className='rounded border border-github-border-default bg-github-canvas-default'
        />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>{t('earlyAccess')}</label>
        <input
          type='checkbox'
          {...register('ogPreferences.earlyAccess')}
          className='rounded border border-github-border-default bg-github-canvas-default'
        />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>{t('mentorship')}</label>
        <input
          type='checkbox'
          {...register('ogPreferences.mentorship')}
          className='rounded border border-github-border-default bg-github-canvas-default'
        />
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>{t('theme')}</label>
        <select
          {...register('ogPreferences.customization.theme')}
          className='w-full rounded-md border border-github-border-default bg-github-canvas-default px-3 py-2'
        >
          <option value='default'>{t('themeDefault')}</option>
          <option value='dark'>{t('themeDark')}</option>
          <option value='light'>{t('themeLight')}</option>
        </select>
      </div>
    </div>
  )
}

export function OGShowcaseSection({ control, errors }: OGSectionProps) {
  const t = useTranslations('profile')
  const { register } = useFormContext<ProfileFormData>()

  return (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-1'>{t('featuredRecipes')}</label>
        <div className='space-y-2'>
          {/* Add dynamic recipe list component here */}
          <p className='text-sm text-github-fg-muted'>{t('comingSoon')}</p>
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>{t('achievements')}</label>
        <div className='space-y-2'>
          {/* Add achievements component here */}
          <p className='text-sm text-github-fg-muted'>{t('comingSoon')}</p>
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>{t('contributions')}</label>
        <div className='space-y-2'>
          {/* Add contributions component here */}
          <p className='text-sm text-github-fg-muted'>{t('comingSoon')}</p>
        </div>
      </div>
    </div>
  )
}

export function OGNetworkSection({ control, errors }: OGSectionProps) {
  const t = useTranslations('profile')
  const { register } = useFormContext<ProfileFormData>()

  return (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium mb-1'>{t('connections')}</label>
        <div className='space-y-2'>
          {/* Add connections component here */}
          <p className='text-sm text-github-fg-muted'>{t('comingSoon')}</p>
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>{t('collaborations')}</label>
        <div className='space-y-2'>
          {/* Add collaborations component here */}
          <p className='text-sm text-github-fg-muted'>{t('comingSoon')}</p>
        </div>
      </div>
      <div>
        <label className='block text-sm font-medium mb-1'>{t('mentees')}</label>
        <div className='space-y-2'>
          {/* Add mentees component here */}
          <p className='text-sm text-github-fg-muted'>{t('comingSoon')}</p>
        </div>
      </div>
    </div>
  )
}
