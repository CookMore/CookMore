import { HeaderWrapper } from '@/app/api/header/HeaderWrapper'
import { FooterWrapper } from '@/app/api/footer/FooterWrapper'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col min-h-screen'>
      <HeaderWrapper />
      <main className='flex-1 overflow-y-auto'>{children}</main>
      <FooterWrapper />
    </div>
  )
}
