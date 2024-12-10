'use client'

import {
  Sun,
  Moon,
  Laptop,
  X,
  User,
  Settings,
  Wallet,
  Calendar,
  Bell,
  Book,
  ChevronRight,
  Check,
  Lock,
  Heart,
  Edit,
  Star,
  Palette,
  Loader,
  MessageSquare,
  Users,
  Image,
} from 'lucide-react'

export const Icons = {
  sun: Sun,
  moon: Moon,
  laptop: Laptop,
  x: X,
  user: User,
  settings: Settings,
  wallet: Wallet,
  calendar: Calendar,
  bell: Bell,
  book: Book,
  chevronRight: ChevronRight,
  check: Check,
  lock: Lock,
  heart: Heart,
  edit: Edit,
  star: Star,
  palette: Palette,
  spinner: Loader,
  messageSquare: MessageSquare,
  users: Users,
  image: Image,
} as const

export type Icon = keyof typeof Icons

export function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' {...props}>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      />
    </svg>
  )
}
