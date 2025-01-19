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

export function IconTrophy(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' {...props}>
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M8 21V16.8C8 15.1198 9.3431 13.7333 11 13.7333H13C14.6569 13.7333 16 15.1198 16 16.8V21'
      />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M17 4H7C7 4 7 10 12 10C17 10 17 4 17 4Z'
      />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M17 4H19C20.1046 4 21 4.89543 21 6V7C21 8.65685 19.6569 10 18 10H17'
      />
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M7 4H5C3.89543 4 3 4.89543 3 6V7C3 8.65685 4.34315 10 6 10H7'
      />
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 13V10' />
    </svg>
  )
}
