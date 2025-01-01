import { IconUser, IconBook, IconChefHat } from '@/app/api/icons'
import type { ProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'
import { cn } from '@/app/api/utils/utils'
import { ipfsService } from '@/app/[locale]/(authenticated)/profile/services/ipfs/ipfs.service'

interface ProfileCardProps {
  profile: Partial<ProfileMetadata>
}

export function ProfileCard({ profile }: ProfileCardProps) {
  if (!profile) return null

  const getImageUrl = (url?: string | null) => {
    if (!url) return null
    try {
      if (url.startsWith('blob:')) return url
      if (url.startsWith('ipfs:')) return ipfsService.getHttpUrl(url)
      if (url.startsWith('http:') || url.startsWith('https:')) return url
      return ipfsService.getHttpUrl(`ipfs://${url}`)
    } catch (error) {
      console.error('Error processing image URL:', error)
      return null
    }
  }

  const bannerUrl = getImageUrl(profile.banner)
  const avatarUrl = getImageUrl(profile.avatar)

  return (
    <div className='space-y-8'>
      {/* Basic Information */}
      <section className='space-y-6'>
        {/* Banner */}
        {bannerUrl && (
          <div className='relative w-full h-32 rounded-lg overflow-hidden'>
            <img src={bannerUrl} alt='Profile Banner' className='w-full h-full object-cover' />
          </div>
        )}

        {/* Profile Image & Basic Details */}
        <div className='flex items-start gap-6'>
          {avatarUrl ? (
            <div className='flex-shrink-0 w-24 h-24 rounded-full overflow-hidden ring-4 ring-github-canvas-default'>
              <img
                src={avatarUrl}
                alt={profile.name || 'Profile'}
                className='w-full h-full object-cover'
              />
            </div>
          ) : (
            <div className='flex-shrink-0 w-24 h-24 rounded-full bg-github-canvas-subtle flex items-center justify-center'>
              <IconUser className='w-12 h-12 text-github-fg-muted' />
            </div>
          )}

          <div className='flex-grow'>
            <h4 className='text-xl font-medium text-github-fg-default'>
              {profile.name || profile.baseName || 'Your Name'}
            </h4>
            <p className='mt-2 text-github-fg-muted whitespace-pre-wrap'>
              {profile.bio || 'Your bio will appear here'}
            </p>
          </div>
        </div>
      </section>

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <section className='space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-github-accent-subtle border border-github-accent-emphasis'>
              <IconBook className='w-5 h-5 text-github-accent-fg' />
            </div>
            <h4 className='text-lg font-medium text-github-fg-default'>Education</h4>
          </div>
          <div className='bg-github-canvas-subtle p-6 rounded-lg border border-github-border-default'>
            <div className='space-y-4'>
              {profile.education.map((edu, index) => (
                <div key={index} className='prose prose-github dark:prose-invert max-w-none'>
                  <h5 className='text-base font-medium'>{edu.institution}</h5>
                  {edu.degree && (
                    <p className='text-sm'>
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </p>
                  )}
                  <p className='text-sm text-github-fg-muted'>
                    {edu.startYear} - {edu.endYear || 'Present'}
                    {edu.location && ` • ${edu.location}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Culinary Information */}
      {profile.culinaryInfo && (
        <section className='space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 rounded-lg bg-github-accent-subtle border border-github-accent-emphasis'>
              <IconChefHat className='w-5 h-5 text-github-accent-fg' />
            </div>
            <h4 className='text-lg font-medium text-github-fg-default'>Culinary Information</h4>
          </div>
          <div className='bg-github-canvas-subtle p-6 rounded-lg border border-github-border-default'>
            <div className='space-y-4'>
              {/* Specialties */}
              {profile.culinaryInfo.specialties?.length > 0 && (
                <div>
                  <h5 className='text-sm font-medium text-github-fg-muted mb-2'>Specialties</h5>
                  <div className='flex flex-wrap gap-2'>
                    {profile.culinaryInfo.specialties.map(
                      (specialty, index) =>
                        specialty && (
                          <span
                            key={`${specialty}-${index}`}
                            className='px-2 py-1 text-sm rounded-full bg-github-accent-subtle text-github-accent-fg'
                          >
                            {specialty}
                          </span>
                        )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
