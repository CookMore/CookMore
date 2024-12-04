import { DefaultAvatar } from '@/components/ui/DefaultAvatar'

export const defaultAvatar = DefaultAvatar
export const defaultAvatarSvg = `
<svg viewBox='0 0 24 24' fill='currentColor'>
  <path fill-rule='evenodd' d='${DefaultAvatar.path}'/>
</svg>
`
export const defaultAvatarDataUrl = `data:image/svg+xml;base64,${Buffer.from(
  defaultAvatarSvg
).toString('base64')}`
